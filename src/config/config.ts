export const logDir = "../log";
export const secret: Secret = {};
export const responseCodes: ResponseCodes = {
    info: {
        success: 0,
    },
    warnings: {
        instanceAlreadyRunning: 20,
    },
    errors: {
        cannotImportScript: 40,
        pgError: 41,
        redisError: 42,
        fetchUrlError: 43,
        noValidProxiesFound: 44,
        browserTypeNotValid: 45,
        browserNavigationError: 46,
    },
    critical: {
        unknownError: 255,
    }
};


export const noRollbarReportCodes = [
    responseCodes.warnings.instanceAlreadyRunning,
];

export const redisOptions: RedisOptions = {
    db: 3,
    regularHost: "127.0.0.1",
    dockerHost: "redis",
    regularPort: 6380,
    dockerPort: 6379,
};

export const pgOptions: PgOptions = {
    regularHost: "127.0.0.1",
    dockerHost: "database",
    regularPort: 5433,
    dockerPort: 5432,
};

export const fetchOptions: FetchOptions = {
    defaultTimeout: 5000,
};

export const browserArgs = [
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-infobars",
    "--window-position=0,0",
    "--ignore-certifcate-errors",
    "--ignore-certifcate-errors-spki-list",
    "--password-store=basic",
    "--use-mock-keychain",
    "--no-first-run",
    "--disable-notifications",
];

export const viewport: Viewport = {
    width: 1366,
    height: 768,
};

export const userDataDir = "/tmp/browser-data-dir";
export const executablePath = "/usr/bin/google-chrome";
export const allowedBrowsers = ["chromium", "firefox", "webkit"];

export const navOptions: NavOptions = {
    afterNavMin: 4758,
    afterNavMax: 7246,
    defaultNavigationTimeout: 20000,
};

export const bypassProxyHosts = ["127.0.0.1", "localhost", "dockerhost"];

export const inputWebsites: InputWebsite[] = [
    {
        url: "https://en.wikipedia.org/wiki/1877_Iquique_earthquake",
        xpathExpr: "//span[contains(@class, 'notifications__title') and (contains(text(), 'Товар распродан') or contains(text(), 'Дата поступления неизвестна'))]"
    },
    {
        url: "https://en.wikipedia.org/wiki/Parliament_of_Australia",
        xpathExpr: "//a"
    },
    {
        url: "https://en.wikipedia.org/wiki/Francis_Hopkinson",
        xpathExpr: "//a"
    },
];