require("dotenv").config();
const websocket = require("./websocket.js");
const user = require("../user/user.js");
const bancho = require("../bancho/bancho.js");
const puppeteer = require("../puppeteer/puppeteer.js");

const command = function (channel, nick, message) {
	if (!message.match(/^!(~?\w+)/))
		return;
	const [raw, command, argument] = message.match(/^!(~?\w+)(?:\s+)?(.*)?/);
	bot(channel, nick, command, argument);
	host(channel, nick, command, argument);
	guest(channel, nick, command, argument);
}
function bot(channel, nick, command, argument) {
	if (channel !== process.env.WEBSOCKET_NICK)
		return;
	switch (command) {
		case "join":
			websocket.connection.sendUTF(`JOIN #${nick}`);
			user.users = user.users.filter(element => element.channel !== nick);
			user.users.push(new user.user(nick));
			websocket.connection.sendUTF(`PRIVMSG #${channel} :${nick} join this channal!`);
			break;
	}
}
function host(channel, nick, command, argument) {
	if (channel !== nick)
		return;
	let _user = user.users.find(element => element._channel === channel);
	switch (command) {
		case "part":
			websocket.connection.sendUTF(`PRIVMSG #${channel} :${channel} part this channal!`);
			websocket.connection.sendUTF(`PART #${channel}`);
			user.users = user.users.filter(element => element.channel !== channel);
			break;
		case "ban_viewbot":
			_user._ban_viewbot = true;
			break;
		case "~ban_viewbot":
			_user._ban_viewbot = false;
			break;
		case "osu_account":
			if ("undefined" === typeof argument)
				return;
			_user._osu_account = argument;
			_user._access_osu_account = false;
			if ("oltex_" === channel)
				_user._access_osu_account = true;
			break;
		case "~osu_account":
			_user._osu_account = "";
			_user._access_osu_account = false;
			break;
	}
}
function guest(channel, nick, command, argument) {
	switch (command) {
		case "help":
			websocket.connection.sendUTF(`PRIVMSG #${channel} :help`);
			break;
		case "roll":
			let random = 0;
			if ("undefined" === typeof argument)
				random = Math.floor(Math.random() * 6);
			websocket.connection.sendUTF(`PRIVMSG #${channel} :${random}`);
			break;
	}
}

const request = function (channel, nick, message) {
	if (!message.match(/https:\/\/osu.ppy.sh\/b+/))
		return;
	const _user = user.users.find(element => element._channel === channel && true === element._access_osu_account);
	if ("undefined" === typeof _user)
		return;
	const promise = puppeteer.request(message);
	promise.then((value) => {
		if ("undefined" === typeof value)
			return;
		bancho.client.getUser(_user._osu_account).sendMessage(`${nick} is requesting a [${message} ${value}]`);
	})
}

const viewbot = function (channel, nick) {
	const _user = user.users.find(element => element._channel === channel);
	if ("undefined" === typeof _user)
		return;
	if (false === _user._ban_viewbot)
		return;
	const promise = puppeteer.viewbot(nick);
	promise.then((value) => {
		if (true === value)
			websocket.connection.sendUTF(`PRIVMSG #${channel} :/ban ${nick}`);
	})
}

module.exports = {
	command, request, viewbot
}