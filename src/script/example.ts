import * as db from "../lib/db";
import log from "../util/logger";

/**
 * Example script
 */
async function main(): Promise<number> {
    await (await db.connectPSQL()).end(); // test if we can connect to postgres

    log.info("example1 script");

    return 0;
}

export default main;