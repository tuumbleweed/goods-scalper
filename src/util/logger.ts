import * as fs from "fs";
import os from "os";
import path from "path";
import winston from "winston";
import process from "process";

import * as config from "../config/config";
import cmdArgs from "./cmlParser";
import dotenvConfigPath from  "./envVars";

if (!fs.existsSync(config.logDir)) {
    fs.mkdirSync(config.logDir);
}
let logLevel = process.env["LOG_LEVEL"];
let logLevelFile = process.env["LOG_LEVEL_FILE"];

// customize log levels
const logLevels = {
    crit: -1,
    error: 0,
    warn: 1,
    info: 2,
    notice: 3,
    http: 4,
    verbose: 5,
    debug: 6,
    console: 7,
    silly: 8,
};
if (!(logLevel in logLevels)) { logLevel = "info"; }
if (!(logLevelFile in logLevels)) { logLevelFile = "error"; }

// customize colors
const logColors = {
    crit: "red bold underline",
    error: "red",
    warn: "yellow",
    info: "green",
    notice: "dim yellow",
    http: "dim cyan",
    verbose: "dim white",
    debug: "dim blue",
    console: "dim magenta",
    silly: "dim gray",
};
winston.addColors(logColors);

const colorizer = winston.format.colorize();
// for console
const logFormatConsole = winston.format.printf(msg => {
    if (typeof (msg.message) === "object") {
        msg.message = JSON.stringify(msg.message, undefined, 4);
    }
    return colorizer.colorize(msg.level, `${msg.timestamp}: ${msg.message}`);
});
// for log files, with PID
const logFormatFiles = winston.format.printf(msg => {
    if (typeof (msg.message) === "object") {
        msg.message = JSON.stringify(msg.message, undefined, 4);
    }
    return colorizer.colorize(msg.level, `${process.pid}, ${msg.timestamp}: ${msg.message}`);
});

const fileLoggerFormat = winston.format.combine(
    winston.format.simple(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormatFiles
);
const consoleLoggerFormat = winston.format.combine(
    winston.format.simple(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormatConsole
);

const filename = path.join(config.logDir, `${cmdArgs.instance}-${os.hostname()}-${logLevelFile}.log`);
const options: winston.LoggerOptions = {
    transports: [
        new winston.transports.Console({
            format: consoleLoggerFormat,
        }),
        new winston.transports.File({
            filename: filename,
            level: logLevelFile,
            format: fileLoggerFormat,
            maxsize: 1e+8,
            maxFiles: 1,
        }),
    ],
    level: logLevel,
    levels: logLevels,
};

const logger = winston.createLogger(options);

logger.info(`Using ${dotenvConfigPath} file to supply config environment variables`);
if (!(process.env["LOG_LEVEL"] in logLevels)) { 
    logger.warn(
        `LOG_LEVEL=${process.env["LOG_LEVEL"]}is not acceptable logging level`
        + `, switching to ${logLevel}`
    );
}
if (!(process.env["LOG_LEVEL_FILE"] in logLevels)) { 
    logger.warn(
        `LOG_LEVEL_FILE=${process.env["LOG_LEVEL_FILE"]}is not acceptable logging level`
        + `, switching to ${logLevelFile}`
    );
}

logger.info(`Logging initialized at ${logLevel} level`);
logger.info(`Logging into file ${filename} initialized at ${logLevelFile} level`);

export default logger;