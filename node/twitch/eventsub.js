require("dotenv").config();
const websocket = require("websocket");
const subscription = require("./api/subscription");

const channel_point = require("./func/channel_point.js");

const client = new websocket.client();

client.connect("wss://eventsub.wss.twitch.tv/ws");
client.on("connect", (connect) => {
    connect.on("message", (message) => {
        if (!message.type === "utf8")
            return;
        console.log(message);
        const messages = JSON.parse(message.utf8Data);
        switch (messages.metadata.message_type) {
            case "session_welcome":
                subscription.subscription.Create(messages.payload.session.id);
                break;
            case "notification":
                channel_point.event(messages.payload.event.reward.title, messages.payload.event.user_input);
                break;
        }
    });
});

process.on("exit", (code) => {
    console.log("AA");
})
process.on("SIGINT", () => {
    process.exit();
})
// "metadata": {
// 	"message_id": "o9ni7oFCIOM9cRgs5fv6HOdVPzUcgoumTBDqlpgeHoo=",
// 	"message_type": "notification",
// 	"message_timestamp": "2023-08-02T09:40:59.95278439Z",
// 	"subscription_type": "channel.channel_points_custom_reward_redemption.add",
// 	"subscription_version": "1"
// },
// "payload": {
// 	"subscription": {
// 		"id": "3afa1b18-b9fa-4674-bfd7-4912191527ba",
// 		"status": "enabled",
// 		"type": "channel.channel_points_custom_reward_redemption.add",
// 		"version": "1",
// 		"condition": {
// 			"broadcaster_user_id": "184218684",
// 			"reward_id": ""
// 		},
// 		"transport": {
// 			"…4eFrmtQiOZ7PKDF0BtJBIGY2VsbC1h"
// 		},
// 		"created_at": "2023-08-02T09:40:33.172081742Z",
// 		"cost": 0
// 	},
// 	"event": {
// 		"broadcaster_user_id": "184218684",
// 		"broadcaster_user_login": "oltex_",
// 		"broadcaster_user_name": "올텍",
// 		"id": "86ada22a-a645-49e2-8039-1e49bedae3f9",
// 		"user_id": "184218684",
// 		"user_login": "oltex_",
// 		"user_name": "올텍",
// 		"user_input": "아아 테스트 테스트",
// 		"status": "fulfilled",
// 		"redeemed_at": "2023-08-02T09:40:59.856330484Z",
// 		"reward": {
// 			"id": "8ea59f33-c5d8-4b95-9d45-b1fd618b3b94",
// 			"title": "리퀘스트",
// 			"prompt": "request map",
// 			"cost": 1
// 		}
// 	}
// }