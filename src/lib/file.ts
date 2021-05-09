import fs from "fs";

import log from "../util/logger";


export async function deleteFileIfExists(filePath: string): Promise<void> {
    if (fs.existsSync(filePath)) {
        log.debug(`Deleting file ${filePath}`);
        fs.unlinkSync(filePath);
    }
}

export async function saveArrayToFile(stringArray: string[], filePath: string): Promise<void> {
    log.debug(`Saving string array to ${filePath}`);
    fs.writeFileSync(filePath, stringArray.join("\n"));
}

/**
 * Create directory if it does not exist
 * @param dirPath path of said directory
 */
export async function createDir(dirPath: string): Promise<void> {
    if (!(fs.existsSync(dirPath))) {
        log.debug(`Creating dir ${dirPath}`);
        fs.mkdirSync(dirPath);
    }
}