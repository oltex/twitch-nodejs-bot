require("dotenv").config();
const request = require("request");

class Subscription {
    Create(session_id) {
        create_subscription(session_id, (res) => {
            console.log(res);
        })
    }
    Get() {
        get_subscription((res) => {
            console.log(res);
        })
    }
    Delete() {
        get_subscription((res) => {
            delete_subscription(res.body.data[0].id, (res) => {
                console.log(res);
            })
        })
    }
}

const create_subscription = (session_id, callback) => {
    const option = {
        url: "https://api.twitch.tv/helix/eventsub/subscriptions",
        method: "POST",
        json: true,
        headers: {
            'Client-Id': process.env.CLIENT_ID,
            'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN,
            'Content-Type': 'application/json'
        },
        body: {
            type: "channel.channel_points_custom_reward_redemption.add",
            version: "1",
            condition: {
                broadcaster_user_id: "184218684"
                //reward_id: 선택적 보상
            },
            transport: {
                method: "websocket",
                session_id: session_id
            }
        }
    }
    request.post(option, (err, res, body) => {
        if (err)
            return console.log(err);
        callback(res);
    })
}

const delete_subscription = (id, callback) => {
    const option = {
        url: "https://api.twitch.tv/helix/eventsub/subscriptions?id=" + id,
        method: "DELETE",
        json: true,
        headers: {
            'Client-Id': process.env.CLIENT_ID,
            'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN,
        }
    }
    request.delete(option, (err, res, body) => {
        if (err)
            return console.log(err);
        callback(res);
    })
}

const get_subscription = (callback) => {
    const option = {
        url: "https://api.twitch.tv/helix/eventsub/subscriptions",
        method: "GET",
        json: true,
        headers: {
            'Client-Id': process.env.CLIENT_ID,
            'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN,
        }
    }
    request.get(option, (err, res, body) => {
        if (err)
            return console.log(err);
        callback(res);
    })
}

var subscription = new Subscription();

module.exports = {
    subscription
}