require("dotenv").config();
const websocket = require("websocket");
const parse = require("./parse.js");

const client = new websocket.client();

client.connect("ws://irc-ws.chat.twitch.tv:80");
client.on("connect", (connect) => {
	module.exports = { connect }
	const chat = require("./func/chat.js");
	const join = require("./func/join.js");
	require("./eventsub.js");

	connect.sendUTF("CAP REQ :twitch.tv/commands twitch.tv/membership twitch.tv/tags");
	connect.sendUTF(`PASS oauth:${process.env.ACCESS_TOKEN}`);
	connect.sendUTF(`NICK ${process.env.BOT_NICK}`);
	connect.sendUTF(`JOIN #${process.env.TWITCH_NICK}`);

	connect.on("message", (message) => {
		if (!message.type === "utf8")
			return;
		const messages = message.utf8Data.trimEnd().split('\r\n');
		for (const iter of messages) {
			const parse_message = parse.message(iter);
			// console.log(parse_message);
			if (null === parse_message)
				continue;
			const command = parse_message.command.command;
			let channel, nick, parameter;
			switch (command) {
				case "PING":
					connect.sendUTF("PONG " + parameter);
					break;
				case "PRIVMSG":
					channel = parse_message.command.channel.match(/(\w+)/)[1];
					nick = parse_message.source.nick;
					parameter = parse_message.parameters.toLowerCase();
					chat.command(channel, nick, parameter);
					chat.request(channel, nick, parameter);
					break;
				case "JOIN":
					channel = parse_message.command.channel.match(/(\w+)/)[1];
					nick = parse_message.source.nick;
					join.viewbot(channel, nick);
					break;
			}
		}
	});
});

module.exports = {
	client
}

// connection.on('error', function (error) {
// 	console.log("Connection Error: " + error.toString());
// });
// connection.on('close', function () {
// 	console.log('Connection Closed');
// 	console.log(`close description: ${connection.closeDescription}`);
// 	console.log(`close reason code: ${connection.closeReasonCode}`);
// });


