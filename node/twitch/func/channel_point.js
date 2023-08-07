const prediction = require("../api/prediction.js");
const poll = require("../api/poll.js");
const announcement = require("../api/announcement.js");
const emoteonly = require("../api/emoteonly.js");
const dice = require("../api/dice.js");

const event = (title, input) => {
    switch (title) {
        case "예측":
            if (!input.match(/^\~(~?[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+)/))
                prediction.prediction.Create(input);
            else
                prediction.prediction.End(input);
            break;
        case "공지":
            announcement.Send(input);
            break;
        case "투표":
            poll.poll.Create(input);
            break;
        case "임티":
            emoteonly.emoteonly.On();
            break;
        case "주사위":
            dice.Roll();
            break;
    }
}

module.exports = {
    event
}