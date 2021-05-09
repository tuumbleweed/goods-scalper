import playwright, { Browser, BrowserContext } from "playwright";

import log from "../util/logger";
import settings from "../util/settings";
import * as error from "../util/error";


function getBrowserOptions(proxy: Proxy): Options {
    const options: Options = {
        args: settings.browserArgs,
        // args: [],
        executablePath: settings.executablePath,
        viewport: settings.viewport,
        headless: settings.cla.headless,
        proxy: proxy !== undefined ? {
            server: `${proxy.host}:${proxy.port}`,
            bypass: settings.bypassProxyHosts.join(","),
            username: proxy.username,
            password: proxy.password,
        } : undefined
    };

    return options;
}

/**
 * Create a browser instance with launch()
 * or launchPersistentContext() based on settings.
 */
export async function launchBrowser(proxy: Proxy | undefined = undefined): Promise<Browser | BrowserContext> {
    log.info("Launching browser");
    const browserOptions = getBrowserOptions(proxy);
    log.debug(browserOptions);

    if (!(settings.allowedBrowsers.includes(settings.browserType))) {
        throw new error.browserTypeNotValid(settings.browserType);
    }
    
    const browser = settings.incognito
        ? await playwright[settings.browserType].launch(browserOptions)
        : await playwright[settings.browserType].launchPersistentContext(
            settings.userDataDir, browserOptions
        );

    return browser;
}

/**
 * Create a browser context if browser is instance of Browser,
 * use browser as context otherwise.
 * Load preload.js script for resulting that context.
 * @param browser Browser or BrowserContext instance based on result of launchBrowser()
 */
export async function createBrowserContext(browser: Browser | BrowserContext): Promise<BrowserContext> {
    log.verbose("Creating browser context");

    let context: BrowserContext;
    if ("newContext" in browser) {
        // browser variable is a Browser instance
        context = await browser.newContext();
    } else {
        // browser variable is already a BrowserContext instance
        context = browser;
    }
    context.setDefaultNavigationTimeout(settings.navOptions.defaultNavigationTimeout);

    await context.addInitScript({ path: "./src/config/preload.js" });
    return context;
}