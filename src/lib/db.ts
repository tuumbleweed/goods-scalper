import pg, { Client, Pool } from "pg";
import fs from "fs";
import { from } from "pg-copy-streams";

import settings from "../util/settings";
import log from "../util/logger";
import * as error from "../util/error";


/**
 * Create PSQL connection. Use settings to supply credentials
 */
export async function connectPSQL(): Promise<Client> {
    const pgConfig: PgOptions = {
        user: settings.secret.pgUser,
        database: settings.secret.pgDatabase,
        password: settings.secret.pgPassword,
        host: settings.pgOptions.host,
        port: settings.pgOptions.port,
    };
    const client = new Client(pgConfig);
    try {
        await client.connect();
        pg.defaults.parseInt8 = true; // to return bigint and bigserial as a number
    } catch (err) {
        throw new error.PGError(pgConfig, err);
    }
    

    return client;
}

/**
 * Copy lines from a file to table.
 * @param filePath file to copy
 * @param tableName table to copy to
 */
export async function copyFrom(tableName: string, filePath: string): Promise<void> {
    log.debug(`Saving file ${filePath} to ${tableName} table...`);
    return new Promise((resolve, reject) => {
        const pool = new Pool({
            user: settings.pgOptions.user,
            database: settings.pgOptions.database,
            password: settings.secret.pgPassword,
            host: settings.pgOptions.host,
            port: settings.pgOptions.port,
        });
    
        pool.connect((err, client, done) => {
            const stream = client.query(from(`COPY ${tableName} FROM STDIN`));
            const fileStream = fs.createReadStream(filePath);
            fileStream.on("error", (err) => { reject(err); });
            stream.on("error", (err) => { reject(err); });
            stream.on("finish", () => {
                log.debug(`Saved file ${filePath} to ${tableName} table`);
                done();
                resolve();
            });
            fileStream.pipe(stream);
        });
    });
}