import puppeteer from 'puppeteer';
import { promises } from 'fs';

export function wait(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

export async function loadJSON(filename) {
    try {
        return JSON.parse(await promises.readFile(filename, {
            encoding: 'utf-8'
        }));
    } catch {
        return null;
    }
}

export function saveJSON(filename, json) {
    return promises.writeFile(filename, JSON.stringify(json), {
        encoding: 'utf-8'
    });
}

export async function getSessionInfo(userDataDir) {
    const session = await loadJSON('session.json');
    if (
        session &&
        new Date(session.AccessTokenExpiry) > new Date()
    ) {
        return session;
    }
    // Taken from snobu/destreamer.
    const browser = await puppeteer.launch({
        args: [
            '--disable-dev-shm-usage',
            '--fast-start',
            '--no-sandbox'
        ],
        headless: false,
        userDataDir
    });
    const page = (await browser.pages())[0];
    await page.goto('https://web.microsoftstream.com', {
        waitUntil: 'load'
    });
    await browser.waitForTarget(target => target.url().endsWith('microsoftstream.com/'), {
        timeout: 150000
    });
    const sessionInfo = await page.evaluate(() => sessionInfo);
    await saveJSON('session.json', sessionInfo);
    await browser.close();
    return sessionInfo;
}
