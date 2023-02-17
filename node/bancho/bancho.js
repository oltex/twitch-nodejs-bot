require('dotenv').config();
const work = require("./work.js");

const bancho = require('bancho.js');
const client = new bancho.BanchoClient({
	username: process.env.BANCHO_USERNAME,
	password: process.env.BANCHO_PASSWORD
});
client.connect();
client.on("PM", async ({ message, user, self }) => {
	if (true === self)
		return;
	message = message.toLowerCase();
	work.command(message, user.ircUsername);
});

module.exports = {
	client
}