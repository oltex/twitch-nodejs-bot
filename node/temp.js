// require("dotenv").config();
// const request = require("request");

// const users = (nick, callback) => {
//     let Parameter = '';
//     if (Array.isArray(nick)) {
//         nick.forEach(element => {
//             Parameter += "login=" + element + "&";
//         });
//     }
//     else {
//         Parameter = "login=" + nick;
//     }

//     const option = {
//         url: "https://api.twitch.tv/helix/users?" + Parameter,
//         method: "GET",
//         json: true,
//         headers: {
//             'Client-Id': process.env.CLIENT_ID,
//             'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN
//         }
//     }
//     request.get(option, (err, res, body) => {
//         if (err)
//             return console.log(err);
//         callback(body.data);
//     })
// }

// module.exports = {
//     users
// }



// curl -X POST 'https://api.twitch.tv/helix/predictions' \

// const token = (callback) => {
//     const option = {
//         url: "https://id.twitch.tv/oauth2/token",
//         json: true,
//         body: {
//             client_id: process.env.CLIENT_ID,
//             client_secret: process.env.CLIENT_SECRET,
//             grant_type: 'client_credentials'
//         }
//     }
//     request.post(option, (err, res, body) => {
//         if (err)
//             return console.log(err);
//         callback(res);
//     })
// }



// setTimeout(() => {
//  getGames(process.env.GET_GAMES,AT,(response) =>{
//  })   
// }, 1000);

// const ban_user = (url) => {
//     const option = {
//         url:  'https://api.twitch.tv/helix/moderation/bans',
//         method: 'POST',
//         body:{
//             client_id: process.env.CLIENT_ID,
//             client_secret: process.env.CLIENT_SECRET,
//             grant_type: 'client_credentials'
//         },
//         -H 'Authorization: Bearer 4a4x78f5wqvkybms7mxfist3jmzul' \
// -H 'Client-Id: t214nt8z1rdtbj69hyarjvh5mi6fh' \
// -H 'Content-Type: application/json' \
//         json: true
//     }
// }

// const delete_chat_messages = () => {
//     const option = {
//         url: 'https://api.twitch.tv/helix/moderation/chat?broadcaster_id='+'876200524'+'&moderator_id='+'876200524',
//         method: 'DELETE',
//         headers:{
//             'Client-Id': 'bjiws1td25y85p9aos1at6to7v924c',
//             'Authorization':'Bearer ' + 'd9y1kdgik0xogaym513y35oglk7vb7'
//         }
//     }

//     request.delete(option, (err, res, body) => {
//         if(err)
//             return console.log(err);

//         console.log('Stails: &{res.statusCode}');
//         console.log(body);

//     }) 
// }

// setTimeout(() => {
//     delete_chat_messages()
// }, 1000);

// const authorization_code_grant_flow = () =>{

// }

