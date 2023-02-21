const puppeteer = require('puppeteer');

const viewbot = async (username) => {
    const browser = await puppeteer.launch({
        // executablePath: chrome
        // headless: false
    });
    const page = await browser.newPage();
    await page.goto("https://twitchinsights.net/bots");

    try {
        await page.waitForSelector("input.form-control-sm");
    } catch (error) {
        await page.close();
        await browser.close();
        return false;
    }
    await page.evaluate(() => {
        const inputBox = document.querySelector("input.form-control-sm");
        inputBox.setAttribute('id', 'twitch_viewbot');
    });
    await page.type("#twitch_viewbot", `${username}`);

    try {
        await page.waitForSelector("tr.odd > td > a");
    } catch (error) {
        await page.close();
        await browser.close();
        return false;
    }
    const viewbotname = await page.evaluate(() => {
        return document.querySelector("tr.odd > td > a").text;
    });
    await page.evaluate(() => {
        document.getElementById("twitch_viewbot").value = "";
    });

    await page.close();
    await browser.close();
    return viewbotname === username ? true : false;
}
const np = async (link) => {
    const browser = await puppeteer.launch({
        // executablePath: chrome
        // headless: false
    });
    const page = await browser.newPage();
    await page.goto(link);

    await page.close();
    await browser.close();
}

module.exports = {
    viewbot
}
