require("dotenv").config();
const request = require("request");

class Prediction {
    Create(argument) {
        let [raw, title, outcome1, outcome2, time] =
            argument.match(/([ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+)?(?:\:)?([ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+)?(?:\/)?([ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+)?(?:\()?(\d+)?(?:\))?/)
        if ("undefined" === typeof title ||
            "undefined" === typeof outcome1 ||
            "undefined" === typeof outcome2)
            return;
        if ("undefined" === typeof time)
            time = 30;

        create_prediction(title, outcome1, outcome2, time, (res) => {
            console.log(res);
        });
    }
    End(argument) {
        if ("undefined" === typeof argument)
            return;
        let [raw, title, outcome] = argument.match(/(?:\~)?([ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+)?(?:\:)?([ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+)?/)
        if ("undefined" === typeof title)
            return;
        get_prediction((res) => {
            if (res.body.data[0].title !== title)
                return;

            let status = "CANCELED";
            let outcoms_id = 0;
            res.body.data[0].outcomes.forEach(element => {
                if (element.title === outcome) {
                    status = "RESOLVED";
                    outcoms_id = element.id;
                }
            });

            end_prediction(res.body.data[0].id, status, outcoms_id, (res) => {
                console.log(res);
            });
        });
    }
}

const create_prediction = (title, outcomes1, outcomes2, time, callback) => {
    const option = {
        url: "https://api.twitch.tv/helix/predictions",
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
            outcomes: [
                {
                    title: outcomes1
                },
                {
                    title: outcomes2
                }
            ],
            prediction_window: time
        }
    }
    request.post(option, (err, res, body) => {
        if (err)
            return console.log(err);
        callback(res);
    })
}

const get_prediction = (callback) => {
    const option = {
        url: "https://api.twitch.tv/helix/predictions" +
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

const end_prediction = (id, status, outcome_id, callback) => {
    const option = {
        url: "https://api.twitch.tv/helix/predictions" +
            "?broadcaster_id=" + process.env.TWITCH_ID +
            "&first=1",
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
            winning_outcome_id: outcome_id
        }
    }
    request.patch(option, (err, res, body) => {
        if (err)
            return console.log(err);
        callback(res);
    })
}

var prediction = new Prediction();

module.exports = {
    prediction
}