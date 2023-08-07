require('dotenv').config();
const bancho = require('bancho.js');
const chat = require("./func/chat.js");

const client = new bancho.BanchoClient({
	username: process.env.BANCHO_USERNAME,
	password: process.env.BANCHO_PASSWORD
});
client.connect();

client.on("PM", async ({ message, user, self }) => {
	if (true === self)
		return;
	message = message.toLowerCase();
	chat.command(message, user.ircUsername);
});

module.exports = {
	client
}