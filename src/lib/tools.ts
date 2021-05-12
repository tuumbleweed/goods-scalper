import fs from "fs";
import process from "process";
import { snapshot } from "process-list";

import log from "../util/logger";
import settings from "../util/settings";
import * as error from "../util/error";


/**
 * Zero-pad number to a desired length
 * @param num 
 * @param length 
 * @returns Zero-padded string
 */
export function zeroPad(num: number, length: number): string {
    return (Array(length).join("0") + num).slice(-length);
}

/**
 * Get a random integer from min to max
 * @param min 
 * @param max 
 */
export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Create a random string of needed length
 * @param length length of the output string
 * @param curStr current string value (needed for recursive getRandomString calls)
 */
export function getRandomString(length: number, curStr: string = ""): string {
    curStr += Math.random().toString(36).substring(2, 2 + length - curStr.length);
    if (curStr.length < length) {
        curStr = getRandomString(length, curStr);
    }
    return curStr;
}

/**
 * Read file, return each of it's lines as item in array of strings.
 * @param filePath file to read
 */
export async function readFileLines(filePath: string): Promise<string[]> {
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const stringArray = fileContents.split("\n");
    while (stringArray.includes("")) {
        stringArray.splice(stringArray.indexOf(""), 1);
    }
    return stringArray;
}

/**
 * Get a random item from array
 * @param array 
 */
export function getRandomItem<T>(array: T[]): T {
    const item = array[Math.floor(Math.random() * array.length)];
    log.verbose(`Chosen item: ${JSON.stringify(item)}`);
    return item;
}

/**
 * Sleep for ms milliseconds
 * @param ms sleep time, milliseconds
 */
export async function sleep(ms: number): Promise<void> {
    log.silly(`Sleeping for ${ms} milliseconds.`);
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Sleep from min to max milliseconds.
 * @param min minimum sleep time, milliseconds
 * @param max maximum sleep time, milliseconds
 */
export async function sleepForRange(min: number, max: number): Promise<void> {
    const sleepFor = getRandomInt(min, max);
    await sleep(sleepFor);
}

export async function createDir(dirPath: string): Promise<void> {
    if (!(fs.existsSync(dirPath))) {
        log.debug(`Creating dir ${dirPath}`);
        fs.mkdirSync(dirPath);
    }
}

/**
 * If found a process with cmdline that includes scriptName string
 * and with different pid from current one - 
 * throw instanceAlreadyRunning warning
 * @param scriptName script name to check for
 */
export async function throwIfAnotherInstanceRunning(scriptName: string): Promise<void> {
    let tasks: { pid: number, cmdline: string, name: string }[];
    for (let i = 0; i < 10; i++) {
        try {
            tasks = await snapshot("pid", "cmdline", "name");
            break;
        } catch (err) {
            if (i < 9) {
                log.warn(err);
                sleep(5000);
                continue;
            } else { throw err; }
        }
    }

    log.debug(`Process pid: ${process.pid}`);
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (
            (task.cmdline.includes(scriptName))
            && (task.pid != process.pid)
            && (task.name === "node")
        ) {
            throw new error.InstanceAlreadyRunning(task.pid, scriptName);
        }
    }
}

/**
 * Stop program execution with exitcode 0 or 1
 * based on result parameter
 */
export async function stopExecution(result: number): Promise<void> {
    const exitCode: number = result;

    await sleep(1000);
    log.debug(`Exiting with exitcode ${exitCode}`);
    if (!settings.cla.keepBrowser) {
        log.silly(`process.exit(${exitCode})`);
        process.exit(exitCode);
    }
}