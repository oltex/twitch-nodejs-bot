const token = (callback) => {
    const option = {
        url: "https://id.twitch.tv/oauth2/token",
        json: true,
        body: {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'authorization_code'
        }
    }
    request.post(option, (err, res, body) => {
        if (err)
            return console.log(err);
        callback(res);
    })
}

const authorize = (callback) => {
    const option = {
        url: "https://id.twitch.tv/oauth2/authorize",
        json: true,
        body: {
            client_id: process.env.CLIENT_ID,
            force_verify: "false",
            response_type: "code",
            redirect_uri: "http://localhost:3000",
            scope: "moderator:manage:announcements",
        }
    }
    request.post(option, (err, res, body) => {
        if (err)
            return console.log(err);
        callback(res);
    })
}