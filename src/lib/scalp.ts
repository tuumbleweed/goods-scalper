import { BrowserContext, Page } from "playwright";

import { goTo, createNewPage } from "../lib/page";
import log from "../util/logger";
import settings from "../util/settings";


/**
 * Iterate through settings.inputWebsites, run scalpWebsite.
 * If it returns an url and screenshot - add it to urlList.
 * @param context 
 * @returns Resulting list of urls and screenshots where we didn't find "item
 * is out of stock" message.
 */
export async function scalpAll(context: BrowserContext): Promise<{ url: string, image: string }[]> {
    const page = await createNewPage(context);
    const resultList: { url: string, image: string }[] = [];

    for (const website of settings.inputWebsites) {
        let result: {url: string, image: string};
        try {
            result = await scalpWebsite(page, website);
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
async function scalpWebsite(page: Page, website: InputWebsite): Promise<{ url: string, image: string }> {
    const finalUrl = await goTo(page, website.url);
    const noneLeftNotification = await page.$(website.xpathExpr);
    const buffer = await page.screenshot({ path: `./tmp/screenshots/${new Date()}.png`, fullPage: false });

    if (noneLeftNotification == undefined) {
        return {url: finalUrl, image: buffer.toString("base64")};
    } else {
        return undefined;
    }
}