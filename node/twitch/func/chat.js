require("dotenv").config();
const twitch = require("../irc.js");
const bancho = require("../../osu/bancho.js");
const crawl = require("../../web/crawl.js");

const subscription = require("../api/subscription.js");

const command = (channel, nick, parameter) => {
	if (!parameter.match(/^!(~?[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+)/))
		return;
	const [raw, command, argument] = parameter.match(/^!(~?[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+)(?:\s+)?(.*)?/);
	switch (command) {
		case "help":
			twitch.connect.sendUTF(`PRIVMSG #${channel} :help`);
			break;
		case "a":
			subscription.subscription.Get();
			break;
		case "b":
			subscription.subscription.Delete();
			break;
	}
}

const request = (channel, nick, parameter) => {
	if (!parameter.match(/https:\/\/osu.ppy.sh\/b+/))
		return;
	crawl.request(parameter).then((value) => {
		if ("undefined" === typeof value)
			return;
		bancho.client.getUser(process.env.BANCHO_USERNAME).sendMessage(`${nick} request [${parameter} ${value}]`);
	});
}

module.exports = {
	command, request
}