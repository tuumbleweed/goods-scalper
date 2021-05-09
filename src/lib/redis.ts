import redis, { RedisClient } from "redis";

import log from "../util/logger";
import settings from "../util/settings";
import * as error from "../util/error";


/**Create and return a client connection to the redis server */
export async function createRedisClient(): Promise<redis.RedisClient> {
    return new Promise((resolve, reject) => {
        const redisOptions: RedisOptions = {
            host: settings.redisOptions.host,
            port: settings.redisOptions.port,
            db: settings.redisOptions.db,
        };
        log.verbose(redisOptions);
        const redisClient = redis.createClient(redisOptions);

        // process events
        redisClient.on("error", err => {
            reject(new error.RedisError(redisOptions, err));
        });
        redisClient.on("end", () => {
            log.verbose("Redis closed.");
        });
        redisClient.on("ready", () => {
            log.verbose("Redis is connected.");
            resolve(redisClient);
        });
    });
}

/**
 * Get a length of a list.
 * @param client redis client
 * @param qName list's key
 */
export async function llen(client: RedisClient, qName: string): Promise<number> {
    return new Promise((resolve, reject) => {
        client.llen(qName, (err, reply) => {
            try {
                if (err) {
                    reject(err);
                    return 0;
                }
                log.verbose(`llen reply: ${reply}`);
                resolve(reply);
            } catch (err) {
                reject(err);
            }
        });
    });
}

/**
 * Get a range of elements from a list.
 * @param client redis client
 * @param qName list's key
 * @param start start index of the range
 * @param finish end index of the range
 */
export async function lrange(client: RedisClient, qName: string, start: number, finish: number): Promise<string[]> {
    return new Promise((resolve, reject) => {
        client.lrange(qName, start, finish, (err, reply) => {
            try {
                if (err) {
                    reject(err);
                    return false;
                }
                log.verbose(`lrange reply: [${reply}]`);
                resolve(reply);
            } catch (err) {
                reject(err);
            }
        });
    });
}

/**
 * Trim a list to the specified range.
 * Only items inside that range will stayin the list.
 * @param client redis client
 * @param qName list's key
 * @param start start index of the range
 * @param finish end index of the range
 */
export async function ltrim(client: RedisClient, qName: string, start: number, finish: number): Promise<string> {
    return new Promise((resolve, reject) => {
        client.ltrim(qName, start, finish, (err, reply) => {
            try {
                if (err) {
                    reject(err);
                    return "FAIL";
                }
                log.verbose(`ltrim reply: ${reply}`);
                resolve(reply);
            } catch (err) {
                reject(err);
            }
        });
    });
}

/**
 * Append one or multiple elements to a list
 * @param client redis client
 * @param qName list's key
 * @param elements elements to append
 */
export async function rpush(client: RedisClient, qName: string, elements: string[]): Promise<number> {
    return new Promise((resolve, reject) => {
        client.rpush(qName, elements, (err, reply) => {
            try {
                if (err) {
                    reject(err);
                    return 2;
                }
                log.verbose(
                    `There are ${reply} elements in a list at key `
                    + `${qName}, ${elements.length} elements pushed.`
                );
                resolve(reply);
            } catch (err) {
                reject(err);
            }
        });
    });
}

/**
 * Remove and return one or multiple elements from a list.
 * @param client redis client
 * @param qName list's key
 * @param prefetchCount max amount of items to fetch
 */
export async function getMessages(client: RedisClient, qName: string, prefetchCount: number): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
        try {
            log.verbose(`Trying to get ${prefetchCount} records from ${qName} queue`);
            const items = await lrange(client, qName, 0, prefetchCount - 1);
            await ltrim(client, qName, prefetchCount, -1);
            resolve(items);
        } catch (err) {
            reject(err);
        }
    });
}