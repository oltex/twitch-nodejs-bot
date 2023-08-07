require("dotenv").config();
const request = require("request");

const Send = (input) => {
    let [raw, message, color] = input.match(/([ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+)?(?:\()?([ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+)?(?:\))?/)
    if ("undefined" === typeof message)
        return;
    if ("undefined" === typeof color)
        color = "primary";
    else {
        switch (color) {
            case "파랑":
                color = "blue";
                break;
            case "초록":
                color = "green";
                break;
            case "주황":
                color = "orange";
                break;
            case "보라":
                color = "purple";
                break;
            default:
                color = "primary"
                break;
        }
    }
    send_announcement(message, color, (res) => {
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
    Send
}