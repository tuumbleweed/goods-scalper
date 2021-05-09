interface Settings {
    PRODUCTION?: boolean,
    logDir: string,
    responseCodes: ResponseCodes,
    noRollbarReportCodes: number[],
    secret: Secret,
    cla?: CommandLineArguments,
    redisOptions: RedisOptions,
    pgOptions: PgOptions,
    startTimestamp?: number,
    fetchOptions: FetchOptions,
    viewport: Viewport,
    browserArgs: string[],
    browserType?: "chromium" | "firefox" | "webkit",
    allowedBrowsers: string[],
    incognito?: boolean,
    headless?: boolean,
    userDataDir?: string,
    navOptions: NavOptions,
    bypassProxyHosts: string[],
    executablePath: string,
    inputWebsites: InputWebsite[],
}
interface ResponseInfoCodes {
    success: number,
}
interface ResponseWarningCodes {
    instanceAlreadyRunning: number,
}
interface ResponseErrorCodes {
    cannotImportScript: number,
    pgError: number,
    redisError: number,
    fetchUrlError: number,
    noValidProxiesFound: number,
    browserTypeNotValid: number,
    browserNavigationError: number,
}
interface CriticalErrorCodes {
    unknownError: number,
}
interface ResponseCodes {
    info: ResponseInfoCodes,
    warnings: ResponseWarningCodes,
    errors: ResponseErrorCodes,
    critical: CriticalErrorCodes,
}
interface Secret {
    rollbarToken?: string,
    apiToken?: string,
    pgUser?: string,
    pgPassword?: string,
    pgDatabase?: string,
    sendgridApiKey?: string,
    adminEmail?: string,
}
interface CommandLineArguments {
    port?: number,
    file?: string,
    number?: number,
    keepBrowser?: boolean,
    incognito?: boolean,
    headless?: boolean,
}
interface RedisOptions {
    host?: string,
    port?: number,
    db: number,
    regularHost?: string,
    dockerHost?: string,
    regularPort?: number,
    dockerPort?: number,
}
interface PgOptions {
    user?: string,
    database?: string,
    password?: string,
    host?: string,
    port?: number,
    regularHost?: string,
    dockerHost?: string,
    regularPort?: number,
    dockerPort?: number,
}
interface Proxy {
    id?: number,
    host: string,
    port: string,
    username?: string,
    password?: string,
    group?: string,
    working?: boolean,
}
interface FetchOptions {
    defaultTimeout: number,
}

interface Viewport {
    width: number,
    height: number,
}

interface NavOptions {
    afterNavMin: number,
    afterNavMax: number,
    defaultNavigationTimeout: number,
}
interface Options {
    args: Settings["browserArgs"],
    viewport: Settings["viewport"],
    headless: boolean,
    executablePath?: string,
    proxy?: {
        server: string,
        bypass: string,
        username: string,
        password: string,
    }
}

interface InputWebsite {
    url: string,
    xpathExpr: string,
}