require("dotenv").config();
const parse = require("./parse.js");

const websocket = require('websocket');
const client = new websocket.client();
let connection;

client.connect('ws://irc-ws.chat.twitch.tv:80');
client.on("connect", function (connect) {
	connection = connect;
	module.exports = {
		connection
	}
	const work = require("./work.js");

	connection.sendUTF('CAP REQ :twitch.tv/commands twitch.tv/membership twitch.tv/tags');
	connection.sendUTF(`PASS ${process.env.WEBSOCKET_PASS}`);
	connection.sendUTF(`NICK ${process.env.WEBSOCKET_NICK}`);
	connection.sendUTF(`JOIN #${process.env.WEBSOCKET_NICK}`);

	connection.on('message', function (message) {
		if (!message.type === 'utf8')
			return;
		const messages = message.utf8Data.trimEnd().split('\r\n');
		for (const iter of messages) {
			const parsedMessage = parse.parseMessage(iter);
			if (null === parsedMessage)
				continue;
			let channel, nick, message;
			switch (parsedMessage.command.command) {
				case "PRIVMSG":
					channel = parsedMessage.command.channel.match(/(\w+)/)[1];
					nick = parsedMessage.source.nick;
					message = parsedMessage.parameters.toLowerCase();
					work.command(channel, nick, message);
					work.link(channel, nick, message);
					break;
				case "JOIN":
					channel = parsedMessage.command.channel.match(/(\w+)/)[1];
					nick = parsedMessage.source.nick;
					work.viewbot(channel, nick);
					break;
			}
		}
	});
});

module.exports = {
	client
}