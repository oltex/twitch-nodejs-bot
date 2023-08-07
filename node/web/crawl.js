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
const request = async (link) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(link);
    
    try {
        await page.waitForSelector("span.beatmapset-header__details-text.beatmapset-header__details-text--title > a");
    } catch (error) {
        await page.close();
        await browser.close();
        return;
    }
    const title = await page.evaluate(() => {
        return document.querySelector("span.beatmapset-header__details-text.beatmapset-header__details-text--title > a").text;
    });

    try {
        await page.waitForSelector("span.beatmapset-header__details-text.beatmapset-header__details-text--artist > a");
    } catch (error) {
        await page.close();
        await browser.close();
        return;
    }
    const artist = await page.evaluate(() => {
        return document.querySelector("span.beatmapset-header__details-text.beatmapset-header__details-text--artist > a").text;
    });

    try {
        await page.waitForSelector("span.beatmapset-header__diff-name");
    } catch (error) {
        await page.close();
        await browser.close();
        return;
    }
    const diff = await page.evaluate(() => {
        return document.querySelector("span.beatmapset-header__diff-name").textContent;
    });

    await page.close();
    await browser.close();
    return `${artist} - ${title}[${diff}]`;
}

module.exports = {
    viewbot, request
}
