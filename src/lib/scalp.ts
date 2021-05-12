import { BrowserContext, Page } from "playwright";

import { goTo, createNewPage } from "./page";
import { zeroPad } from "./tools";
import log from "../util/logger";
import settings from "../util/settings";


/**
 * Get current local datetime in this format:
 * 2021-05-11_08:06:20
 */
function getStringDateTime(): string {
    const dt = new Date();
    return `${dt.getFullYear()}-${zeroPad(dt.getMonth(), 2)}-${zeroPad(dt.getDate(), 2)}_`
        + `${zeroPad(dt.getHours(), 2)}:${zeroPad(dt.getMinutes(), 2)}:${zeroPad(dt.getSeconds(), 2)}`;
}

/**
 * Iterate through settings.inputWebsites, run scalpWebsite.
 * If it returns an url and screenshot - add it to urlList.
 * @param context 
 * @returns Resulting list of urls and screenshots where we didn't find "item
 * is out of stock" message.
 */
export async function scalpAll(context: BrowserContext): Promise<{ url: string, image: string }[]> {
    const screenshotDir = getStringDateTime();
    const page = await createNewPage(context);
    const resultList: { url: string, image: string }[] = [];

    for (const website of settings.inputWebsites) {
        let result: {url: string, image: string};
        try {
            result = await scalpWebsite(page, website, screenshotDir);
        } catch (err) {
            log.warn(err.message);
        }
        if (result) {
            resultList.push(result);
        }
    }

    page.close();

    return resultList;
}

/**
 * Visit a page, check for "item is out of stock" message.
 * @param page 
 * @param website 
 * @returns url and screenshot if message not found, undefined if otherwise.
 */
async function scalpWebsite(page: Page, website: InputWebsite, screenshotDir: string):
Promise<{ url: string, image: string }> {
    const finalUrl = await goTo(page, website.url);
    const noneLeftNotification = await page.$(website.xpathExpr);
    const buffer = await page.screenshot({
        path: `./tmp/screenshots/${screenshotDir}/${new Date().toTimeString()}.png`,
        fullPage: false
    });

    if (noneLeftNotification == undefined) {
        log.verbose("Maybe found something");
        return {url: finalUrl, image: buffer.toString("base64")};
    } else {
        log.verbose("Out of stock");
        return undefined;
    }
}