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

	connection.sendUTF(`PRIVMSG #lyuun_: ""`);

	// let intervalObj = setInterval(() => {
	// 	connection.sendUTF(`PRIVMSG #lyuun_: ""`);
	// }, 1000 * 60 * 1);

	connection.on('message', function (message) {
		if (!message.type === 'utf8')
			return;
		const messages = message.utf8Data.trimEnd().split('\r\n');
		console.debug(messages);
		for (const iter of messages) {
			const parsedMessage = parse.parseMessage(iter);
			if (null === parsedMessage)
				continue;
			let channel, nick, message;
			switch (parsedMessage.command.command) {
				case 'PING':
					connection.sendUTF('PONG ' + parsedMessage.parameters);
					break;
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
	connection.on('error', function (error) {
		console.log("Connection Error: " + error.toString());
	});
	connection.on('close', function () {
		console.log('Connection Closed');
		console.log(`close description: ${connection.closeDescription}`);
		console.log(`close reason code: ${connection.closeReasonCode}`);
	});
});



module.exports = {
	client
}