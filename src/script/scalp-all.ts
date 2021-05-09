import * as scalp from "../lib/scalp";
import { createBrowserContext, launchBrowser } from "../lib/browser";
import log from "../util/logger";

/**
 * Scalp all the websites from config.inputWebsites,
 * Send an email address to admin if resulting urlList has any urls in it.
 */
async function main(): Promise<number> {

    log.info("Scalp script");
    const browser = await launchBrowser();
    const context = await createBrowserContext(browser);

    const urlList = await scalp.scalpAll(context);
    log.info(urlList);

    return 0;
}

export default main;