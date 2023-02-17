const user = require("../user/user.js");

const command = function (message, ircUsername) {
	if (!message.match(/^!(\w+)/))
		return;
	const [raw, command, argument] = message.match(/^!(\w+)(?:\s+)?(.*)?/);
	switch (command) {
		case "access_osu_account":
			let _user = user.users.find(element => element._channel === argument && element._osu_account === ircUsername);
			if ("undefined" === typeof _user)
				return;
			_user._access_osu_account = true;
			break;
	}
}

module.exports = {
	command
}