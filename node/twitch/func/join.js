require("dotenv").config();
const twitch = require("../irc.js");
const crawl = require("../../web/crawl.js");
const api = require("../../temp.js");

const viewbot = function (channel, nick) {
	crawl.viewbot(nick).then((value) => {
		if (true === value) {
			api.users([process.env.TWITCH_NICK, process.env.BOT_NICK, nick], (res) => {
				api.bans(res[0].id, res[1].id, res[2].id, (res) => {
				})
			})
		}
	})
}

module.exports = {
	viewbot
}