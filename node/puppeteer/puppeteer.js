const puppeteer = require('puppeteer');
let browser;
let page;
const init = async () => {
    browser = await puppeteer.launch({
        // executablePath: chrome
        // headless: false
    });
    page = await browser.newPage();
    await page.goto("https://twitchinsights.net/bots");
}
init();

const viewbot = async (username) => {
    await page.waitForSelector("input.form-control-sm");
    await page.evaluate(() => {
        const inputBox = document.querySelector("input.form-control-sm");
        inputBox.setAttribute('id', 'twitch_viewbot');
    });
    await page.type("#twitch_viewbot", `${username}`);
    const viewbotname = await page.evaluate(() => {
        return document.querySelector("tr.odd > td > a").text;
    });
    await page.evaluate(() => {
        document.getElementById("twitch_viewbot").value = "";
    });
    return viewbotname === username ? true : false;
}

module.exports = {
    viewbot
}
// await page.close();
// await browser.close();