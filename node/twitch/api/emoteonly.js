require("dotenv").config();
const request = require("request");

class EmoteOnly {
    constructor() {
        let _timer = null;
    }
    On() {
        update_emoteonly("true", (res) => {
            console.log(res);
            if (null !== this._timer)
                this._timer = setTimeout(this.Off, 30000);
        })
    }
    Off() {
        update_emoteonly("false", (res) => {
            console.log(res);
            this._timer = null;
        })
    }
}



const update_emoteonly = (emote_mode, callback) => {
    const option = {
        url: "https://api.twitch.tv/helix/chat/settings" +
            "?broadcaster_id=" + process.env.TWITCH_ID +
            "&moderator_id=" + process.env.TWITCH_ID,
        method: "PATCH",
        json: true,
        headers: {
            'Client-Id': process.env.CLIENT_ID,
            'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN,
            'Content-Type': 'application/json'
        },
        body: {
            emote_mode: emote_mode
        }
    }
    request.patch(option, (err, res, body) => {
        if (err)
            return console.log(err);
        callback(res);
    })
}

var emoteonly = new EmoteOnly();

module.exports = {
    emoteonly
}