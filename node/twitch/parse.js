const message = function (message) {
	let parsedMessage = {
		tags: null,
		source: null,
		command: null,
		parameters: null
	};

	let idx = 0;

	let rawTagsComponent = null;
	let rawSourceComponent = null;
	let rawCommandComponent = null;
	let rawParametersComponent = null;

	if (message[idx] === '@') {
		let endIdx = message.indexOf(' ');
		rawTagsComponent = message.slice(1, endIdx);
		idx = endIdx + 1;
	}

	if (message[idx] === ':') {
		idx += 1;
		let endIdx = message.indexOf(' ', idx);
		rawSourceComponent = message.slice(idx, endIdx);
		idx = endIdx + 1;
	}

	let endIdx = message.indexOf(':', idx);
	if (-1 == endIdx) {
		endIdx = message.length;
	}

	rawCommandComponent = message.slice(idx, endIdx).trim();

	if (endIdx != message.length) {
		idx = endIdx + 1;
		rawParametersComponent = message.slice(idx);
	}

	parsedMessage.command = parseCommand(rawCommandComponent);

	if (null == parsedMessage.command) {
		return null;
	}
	else {
		if (null != rawTagsComponent) {
			parsedMessage.tags = parseTags(rawTagsComponent);
		}

		parsedMessage.source = parseSource(rawSourceComponent);

		parsedMessage.parameters = rawParametersComponent;
		if (rawParametersComponent && rawParametersComponent[0] === '!') {
			parsedMessage.command = parseParameters(rawParametersComponent, parsedMessage.command);
		}
	}

	return parsedMessage;
}

function parseTags(tags) {
	const tagsToIgnore = {
		'client-nonce': null,
		'flags': null
	};

	let dictParsedTags = {};
	let parsedTags = tags.split(';');

	parsedTags.forEach(tag => {
		let parsedTag = tag.split('=');  // Tags are key/value pairs.
		let tagValue = (parsedTag[1] === '') ? null : parsedTag[1];

		switch (parsedTag[0]) {  // Switch on tag name
			case 'badges':
			case 'badge-info':
				// badges=staff/1,broadcaster/1,turbo/1;

				if (tagValue) {
					let dict = {};  // Holds the list of badge objects.
					// The key is the badge's name (e.g., subscriber).
					let badges = tagValue.split(',');
					badges.forEach(pair => {
						let badgeParts = pair.split('/');
						dict[badgeParts[0]] = badgeParts[1];
					})
					dictParsedTags[parsedTag[0]] = dict;
				}
				else {
					dictParsedTags[parsedTag[0]] = null;
				}
				break;
			case 'emotes':
				// emotes=25:0-4,12-16/1902:6-10

				if (tagValue) {
					let dictEmotes = {};  // Holds a list of emote objects.
					// The key is the emote's ID.
					let emotes = tagValue.split('/');
					emotes.forEach(emote => {
						let emoteParts = emote.split(':');

						let textPositions = [];  // The list of position objects that identify
						// the location of the emote in the chat message.
						let positions = emoteParts[1].split(',');
						positions.forEach(position => {
							let positionParts = position.split('-');
							textPositions.push({
								startPosition: positionParts[0],
								endPosition: positionParts[1]
							})
						});

						dictEmotes[emoteParts[0]] = textPositions;
					})

					dictParsedTags[parsedTag[0]] = dictEmotes;
				}
				else {
					dictParsedTags[parsedTag[0]] = null;
				}

				break;
			case 'emote-sets':
				// emote-sets=0,33,50,237

				let emoteSetIds = tagValue.split(',');  // Array of emote set IDs.
				dictParsedTags[parsedTag[0]] = emoteSetIds;
				break;
			default:
				// If the tag is in the list of tags to ignore, ignore
				// it; otherwise, add it.

				if (tagsToIgnore.hasOwnProperty(parsedTag[0])) {
					;
				}
				else {
					dictParsedTags[parsedTag[0]] = tagValue;
				}
		}
	});

	return dictParsedTags;
}

// Parses the command component of the IRC message.

function parseCommand(rawCommandComponent) {
	let parsedCommand = null;
	commandParts = rawCommandComponent.split(' ');

	switch (commandParts[0]) {
		case 'JOIN':
		case 'PART':
		case 'NOTICE':
		case 'CLEARCHAT':
		case 'HOSTTARGET':
		case 'PRIVMSG':
			parsedCommand = {
				command: commandParts[0],
				channel: commandParts[1]
			}
			break;
		case 'PING':
			parsedCommand = {
				command: commandParts[0]
			}
			break;
		case 'CAP':
			parsedCommand = {
				command: commandParts[0],
				isCapRequestEnabled: (commandParts[2] === 'ACK') ? true : false,
			}
			break;
		case 'GLOBALUSERSTATE':
			parsedCommand = {
				command: commandParts[0]
			}
			break;
		case 'USERSTATE':   // Included only if you request the /commands capability.
		case 'ROOMSTATE':   // But it has no meaning without also including the /tags capabilities.
			parsedCommand = {
				command: commandParts[0],
				channel: commandParts[1]
			}
			break;
		case 'RECONNECT':
			// console.log('The Twitch IRC server is about to terminate the connection for maintenance.')
			parsedCommand = {
				command: commandParts[0]
			}
			break;
		case '421':
			// console.log(`Unsupported IRC command: ${commandParts[2]}`)
			return null;
		case '001':  // Logged in (successfully authenticated). 
			parsedCommand = {
				command: commandParts[0],
				channel: commandParts[1]
			}
			break;
		case '002':  // Ignoring all other numeric messages.
		case '003':
		case '004':
		case '353':  // Tells you who else is in the chat room you're joining.
		case '366':
		case '372':
		case '375':
		case '376':
			// console.log(`numeric message: ${commandParts[0]}`)
			return null;
		default:
			// console.log(`\nUnexpected command: ${commandParts[0]}\n`);
			return null;
	}

	return parsedCommand;
}

// Parses the source (nick and host) components of the IRC message.

function parseSource(rawSourceComponent) {
	if (null == rawSourceComponent) {  // Not all messages contain a source
		return null;
	}
	else {
		let sourceParts = rawSourceComponent.split('!');
		return {
			nick: (sourceParts.length == 2) ? sourceParts[0] : null,
			host: (sourceParts.length == 2) ? sourceParts[1] : sourceParts[0]
		}
	}
}

// Parsing the IRC parameters component if it contains a command (e.g., !dice).

function parseParameters(rawParametersComponent, command) {
	let idx = 0
	let commandParts = rawParametersComponent.slice(idx + 1).trim();
	let paramsIdx = commandParts.indexOf(' ');

	if (-1 == paramsIdx) { // no parameters
		command.botCommand = commandParts.slice(0);
	}
	else {
		command.botCommand = commandParts.slice(0, paramsIdx);
		command.botCommandParams = commandParts.slice(paramsIdx).trim();
		// TODO: remove extra spaces in parameters string
	}

	return command;
}
module.exports = {
	message,
};