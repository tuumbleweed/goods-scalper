import { BrowserContext, Page, Response } from "playwright";

import * as error from "../util/error";
import log from "../util/logger";
import { sleepForRange } from "./tools";
import settings from "../util/settings";

/**
 * Create a new page.
 * Log all console events.
 * @param context context to create a page on.
 */
export async function createNewPage(context: BrowserContext): Promise<Page> {
    const page = await context.newPage();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    page.on("console", msg => log.console(msg.text()));

    log.info("Created new page");

    return page;
}

/**
 * Visit url, wait for a few seconds.
 * Throw error.browserNavigationError if unable.
 */
export async function goTo(page: Page, targetUrl: string): Promise<[string, number]> {

    log.http(`Going to "${targetUrl}"`);
    let resp: Response;
    try {
        resp = await page.goto(targetUrl, { waitUntil: "load" });
    } catch (err) {
        const regex = /(.*?::.*? at.*?)\n/;
        let errMessage = err.message.match(regex);
        if (errMessage === null) {
            errMessage = err.message;
        } else {
            errMessage = errMessage[1];
        }
        log.warn(`Got error ${errMessage}`);
        throw new error.browserNavigationError(targetUrl);
    }
    if (resp === null) { throw new error.browserNavigationError(targetUrl); }
    const logMessage = `Got ${resp.status()} while trying to load "${targetUrl}"`;
    if (resp.status() < 300) {
        log.http(logMessage);
    } else {
        log.notice(logMessage);
    }

    await sleepForRange(
        settings.navOptions.afterNavMin,
        settings.navOptions.afterNavMax,
    );
    return [page.url(), resp.status()];
}