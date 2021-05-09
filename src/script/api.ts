import app from "../lib/app";
import log from "../util/logger";
import * as db from "../lib/db";
import * as redis from "../lib/redis";
import cmdArgs from "../util/cmlParser";
import { sleep } from "../lib/tools";

/**
 * Start Express server.
 */
async function main(): Promise<number> {
    if (cmdArgs.docker) { await sleep(4000); }
    await (await db.connectPSQL()).end(); // test if we can connect to postgres
    (await redis.createRedisClient()).quit(); // test if we can connect to redis
    return new Promise((resolve) => {
        app.listen(app.get("port"), () => {
            log.info(
                `App is running at http://127.0.0.1:${app.get("port")}`
                + ` in ${app.get("env")} mode`,
            );
            log.info("Press CTRL-C to stop\n");
        });
    
        app.on("SIGTERM", () => {
            resolve(0);
        });
    });
}

export default main;