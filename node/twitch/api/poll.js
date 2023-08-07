require("dotenv").config();
const request = require("request");

class Poll {
    Create(input) {
        let [raw, title, choice1, choice2, time] =
            input.match(/([ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+)?(?:\:)?([ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+)?(?:\/)?([ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+)?(?:\s+)?(\d+)?/)
        if ("undefined" === typeof title ||
            "undefined" === typeof choice1 ||
            "undefined" === typeof choice2)
            return;
        if ("undefined" === typeof time)
            time = 30;

        create_poll(title, choice1, choice2, (res) => {
            console.log(res);
        });
    }
    Get() {
        get_poll((res) => {
            console.log(res);
        })
    }
    End(input) {
        if ("undefined" === typeof input)
            return;
        get_poll((res) => {
            if (res.body.data[0].title !== input)
                return;
            end_poll(res.body.data[0].id, "TERMINATED", (res) => {
                console.log(res);
            });
        });
    }
}

const create_poll = (title, choice1, choice2, callback) => {
    const option = {
        url: "https://api.twitch.tv/helix/polls",
        method: "POST",
        json: true,
        headers: {
            'Client-Id': process.env.CLIENT_ID,
            'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN,
            'Content-Type': 'application/json'
        },
        body: {
            broadcaster_id: process.env.TWITCH_ID,
            title: title,
            choices: [
                {
                    title: choice1
                },
                {
                    title: choice2
                }
            ],
            channel_points_voting_enabled: "false",
            channel_points_per_vote: "1",
            duration: 60
        }
    }
    request.post(option, (err, res, body) => {
        if (err)
            return console.log(err);
        callback(res);
    })
}

const get_poll = (callback) => {
    const option = {
        url: "https://api.twitch.tv/helix/polls" +
            "?broadcaster_id=" + process.env.TWITCH_ID +
            "&first=1",
        method: "GET",
        json: true,
        headers: {
            'Client-Id': process.env.CLIENT_ID,
            'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN
        }
    }
    request.get(option, (err, res, body) => {
        if (err)
            return console.log(err);
        callback(res);
    })
}

const end_poll = (id, status, callback) => {
    const option = {
        url: "https://api.twitch.tv/helix/polls",
        method: "PATCH",
        json: true,
        headers: {
            'Client-Id': process.env.CLIENT_ID,
            'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN,
            'Content-Type': 'application/json'
        },
        body: {
            broadcaster_id: process.env.TWITCH_ID,
            id: id,
            status: status,
        }
    }
    request.patch(option, (err, res, body) => {
        if (err)
            return console.log(err);
        callback(res);
    })
}

var poll = new Poll();

module.exports = {
    poll
}