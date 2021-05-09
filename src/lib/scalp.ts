import { BrowserContext, Page } from "playwright";

import { goTo, createNewPage } from "../lib/page";
import log from "../util/logger";
import settings from "../util/settings";


/**
 * Iterate through settings.inputWebsites, run scalpWebsite.
 * If it returns an url - add it to urlList.
 * @param context 
 * @returns Resulting list of urls where we didn't find "item is out of stock" message.
 */
export async function scalpAll(context: BrowserContext): Promise<string[]> {
    const page = await createNewPage(context);
    const urlList: string[] = [];

    for (const website of settings.inputWebsites) {
        let finalUrl: string;
        try {
            finalUrl = await scalpWebsite(page, website);
        } catch (err) {
            log.warn(err.message);
        }
        if (finalUrl) {
            urlList.push(finalUrl);
        }
    }

    page.close();

    return urlList;
}

/**
 * Visit a page, check for "item is out of stock" message.
 * @param page 
 * @param website 
 * @returns url if message not found, undefined if otherwise.
 */
async function scalpWebsite(page: Page, website: InputWebsite): Promise<string> {
    const finalUrl = await goTo(page, website.url);
    const noneLeftNotification = await page.$(website.xpathExpr);

    if (noneLeftNotification == undefined) {
        return finalUrl;
    } else {
        return undefined;
    }
}