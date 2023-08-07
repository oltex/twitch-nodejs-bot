require("dotenv").config();
const request = require("request");
// const irc = require("../irc.js");

const Roll = () => {
    const random = Math.floor(Math.random() * 6 + 1);
    const message = "주사위: " + random;
    // irc.connect.sendUTF(`PRIVMSG #oltex_ :${random}`);
    send_announcement(message, "purple", (res) => {
    });
}

const send_announcement = (message, color, callback) => {
    const option = {
        url: "https://api.twitch.tv/helix/chat/announcements" +
            "?broadcaster_id=" + process.env.TWITCH_ID +
            "&moderator_id=" + process.env.TWITCH_ID,
        method: "POST",
        json: true,
        headers: {
            'Client-Id': process.env.CLIENT_ID,
            'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN
        },
        body: {
            message: message,
            color: color
        }
    }
    request.post(option, (err, res, body) => {
        if (err)
            return console.log(err);
        callback(res);
    })
}


module.exports = {
    Roll
}