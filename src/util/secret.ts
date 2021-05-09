import log from "./logger";


export const ENVIRONMENT = process.env.NODE_ENV;
export const PRODUCTION = ENVIRONMENT === "production"; // Anything else is treated as 'dev'
export const POSTGRES_PASSWORD = process.env["POSTGRES_PASSWORD"];
export const ROLLBAR_TOKEN = process.env["ROLLBAR_TOKEN"];
export const API_TOKEN = process.env["API_TOKEN"];
export const POSTGRES_USER = process.env["POSTGRES_USER"];
export const POSTGRES_DB = process.env["POSTGRES_DB"];
export const LOG_LEVEL = process.env["LOG_LEVEL"];
export const LOG_LEVEL_FILE = process.env["LOG_LEVEL_FILE"];

const requiredVariables: string[][] = [
    [ENVIRONMENT, "ENVIRONMENT"],
    [POSTGRES_PASSWORD, "POSTGRES_PASSWORD"],
    [ROLLBAR_TOKEN, "ROLLBAR_TOKEN"],
    [API_TOKEN, "API_TOKEN"],
    [POSTGRES_USER, "POSTGRES_USER"],
    [POSTGRES_DB, "POSTGRES_DB"],
    [LOG_LEVEL, "LOG_LEVEL"],
    [LOG_LEVEL_FILE, "LOG_LEVEL_FILE"],
];
requiredVariables.forEach(elem => {
    if (!elem[0]) {
        log.error(`Set ${elem[1]} environment variable`);
        process.exit(301);
    }
    log.debug(`${elem[1]}=${elem[0]}`);
});