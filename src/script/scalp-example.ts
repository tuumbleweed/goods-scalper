import * as db from "../lib/db";
import { createBrowserContext, launchBrowser } from "../lib/browser";
import { createNewPage, goTo } from "../lib/page";
import log from "../util/logger";

/**
 * Example script
 */
async function main(): Promise<number> {

    log.info("example1 script");
    const browser = await launchBrowser();
    const context = await createBrowserContext(browser);
    const page = await createNewPage(context);
    
    return 0;
}

export default main;