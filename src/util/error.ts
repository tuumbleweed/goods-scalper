import Rollbar from "rollbar";

import log from "./logger";
import settings from "./settings";
import { stopExecution } from "../lib/tools";


export const rollbar = new Rollbar({
    accessToken: settings.secret.rollbarToken,
    captureUncaught: true,
    captureUnhandledRejections: true,
    environment: settings.PRODUCTION ? "production" : "development",
    codeVersion: process.env.npm_package_version,
});

export class GenericCodedError extends Error {
    code: number;
    constructor(message: string, code: number) {
        super(message + `, Error code: ${code}`);
        this.code = code;
    }
}

export class CannotImportScript extends GenericCodedError {
    constructor(scriptName: string) {
        super(
            `Cannot find the script './script/${scriptName}'`,
            settings.responseCodes.errors.cannotImportScript
        );
    }
}

export class PGError extends GenericCodedError {
    constructor(pgConfig: PgOptions, err: Error) {
        super(
            `PostgreSQL error. pgConfig: ${JSON.stringify(pgConfig)}`
            + `\noriginal message:\n"${err.message}"`,
            settings.responseCodes.errors.pgError
        );
    }
}


export class RedisError extends GenericCodedError {
    constructor(redisOptions: RedisOptions, err: Error) {
        super(
            `Redis error. redisOptions: ${JSON.stringify(redisOptions)}`
            + `\noriginal message:\n"${err.message}"`,
            settings.responseCodes.errors.redisError
        );
    }
}

export class InstanceAlreadyRunning extends GenericCodedError {
    constructor(pid: number, scriptName: string) {
        super(
            `The "${scriptName}" script is already running with pid ${pid}`,
            settings.responseCodes.warnings.instanceAlreadyRunning
        );
    }
}

export class FetchUrlError extends GenericCodedError {
    constructor(url: string) {
        super(
            `Cannot fetch url '${url}'`,
            settings.responseCodes.errors.fetchUrlError
        );
    }
}

export class NoValidProxiesFound extends GenericCodedError {
    constructor(filePath: string) {
        super(
            `File ${filePath} does not contain valid proxies.
Format should be: host:port:username:password`,
            settings.responseCodes.errors.noValidProxiesFound
        );
    }
}

export class browserTypeNotValid extends GenericCodedError {
    constructor(browserType: string) {
        super(
            `Browser type ${browserType} is not in [${settings.allowedBrowsers}]`,
            settings.responseCodes.errors.browserTypeNotValid
        );
    }
}

export class browserNavigationError extends GenericCodedError {
    constructor(url: string) {
        super(
            `Cannot navigate to '${url}'`,
            settings.responseCodes.errors.browserNavigationError
        );
    }
}


/**
 * Log error with appropriate log level.
 * @param err error to log
 */
export function reportError(err: GenericCodedError): number {
    let ec: number;
    const itIsWarning =
        Object.values(settings.responseCodes.warnings).indexOf(err.code) > -1;
    const itIsError =
        Object.values(settings.responseCodes.errors).indexOf(err.code) > -1;
    const unexpectedError = !(err instanceof GenericCodedError);

    switch (true) {
        case (itIsWarning):
            log.warn(err.stack);
            log.warn(err.message);
            ec = err.code;
            break;
        case (itIsError):
            log.error(err.stack);
            log.error(err.message);
            ec = err.code;
            break;
        case (unexpectedError):
            log.error(err.stack);
            log.crit(err.message);
            ec = settings.responseCodes.critical.unknownError;
            break;
        default:
            log.error(err.stack);
            log.crit(err.message);
            log.crit("This should never happen.");
            ec = settings.responseCodes.critical.unknownError;
    }

    const reportToRollbar = 
            (Object.values(settings.noRollbarReportCodes).indexOf(ec) === -1);
    if (!(reportToRollbar)) { return ec; }
    log.debug("Reporting error to rollbar...");
    switch (true) {
        case (itIsWarning):
            rollbar.warning(err);
            break;
        case (itIsError):
            rollbar.error(err);
            break;
        default:
            rollbar.critical(err);
    }

    return ec;
}

/**
 * Log error and stop program execution
 * @param err error to log
 */
export async function handleError(err: GenericCodedError): Promise<void> {
    const ec = reportError(err);
    await stopExecution(ec);
}
