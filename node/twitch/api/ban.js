const bans = (channel_id, nick_id, user_id, callback) => {
    const option = {
        url: "https://api.twitch.tv/helix/moderation/bans" +
            "?broadcaster_id=" + channel_id +
            "&moderator_id=" + nick_id,
        method: "POST",
        json: true,
        headers: {
            'Client-Id': process.env.CLIENT_ID,
            'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN,
            'Content-Type': 'application/json'
        },
        body: {
            data: {
                user_id: user_id
            }
        }
    }
    request.post(option, (err, res, body) => {
        if (err)
            return console.log(err);
        callback(res);
    })
}
