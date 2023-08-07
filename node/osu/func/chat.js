const user = require("../../user/user.js");

const command = (message, ircUsername) => {
	if (!message.match(/^!(\w+)/))
		return;
	const [raw, command, argument] = message.match(/^!(\w+)(?:\s+)?(.*)?/);
	switch (command) {
		
	}
}

module.exports = {
	command
}