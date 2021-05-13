import * as scalp from "../lib/scalp";
import * as email from "../lib/email";
import { createBrowserContext, launchBrowser } from "../lib/browser";
import log from "../util/logger";
import { throwIfAnotherInstanceRunning } from "../lib/tools";

/**
 * Scalp all the websites from config.inputWebsites,
 * Send an email address to admin if resultList is not empty.
 */
async function main(): Promise<number> {

    log.info("Scalp script");
    await throwIfAnotherInstanceRunning("scalp-all");
    const browser = await launchBrowser();
    const context = await createBrowserContext(browser);

    const resultList = await scalp.scalpAll(context);
    log.info(resultList.map(result => result.url));
    if (resultList.length) {
        await email.sendEmail(resultList);
    }

    return 0;
}

export default main;