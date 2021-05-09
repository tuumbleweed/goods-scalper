import log from "./logger";
import * as config from "../config/config";
import * as secret from "./secret";
import cmdArgs from "./cmlParser";


export function getSettings(): Settings {
    const settings: Settings = config;
    settings.PRODUCTION = secret.PRODUCTION;
    settings.cla = {};
    settings.cla.port = parseInt(cmdArgs.port);
    settings.cla.file = cmdArgs.file;
    settings.cla.number = parseInt(cmdArgs.number);
    settings.startTimestamp = Date.now();
    settings.secret.rollbarToken = secret.ROLLBAR_TOKEN;
    settings.secret.pgUser = secret.POSTGRES_USER;
    settings.secret.pgPassword = secret.POSTGRES_PASSWORD;
    settings.secret.pgDatabase = secret.POSTGRES_DB;
    settings.secret.apiToken = secret.API_TOKEN;
    settings.redisOptions.host = cmdArgs.docker
        ? settings.redisOptions.dockerHost
        : settings.redisOptions.regularHost;
    settings.redisOptions.port = cmdArgs.docker
        ? settings.redisOptions.dockerPort
        : settings.redisOptions.regularPort;
    settings.pgOptions.host = cmdArgs.docker
        ? settings.pgOptions.dockerHost
        : settings.pgOptions.regularHost;
    settings.pgOptions.port = cmdArgs.docker
        ? settings.pgOptions.dockerPort
        : settings.pgOptions.regularPort;

    log.verbose("Settings:");
    log.verbose(settings);

    return settings;
}

const result = getSettings();
export default result;