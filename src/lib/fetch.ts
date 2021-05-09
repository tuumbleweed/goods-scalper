import fetch, { Response } from "node-fetch";
import AbortController from "abort-controller";
import ProxyAgent from "proxy-agent";
import libxmljs from "libxmljs";

import * as error from "../util/error";
import log from "../util/logger";
import settings from "../util/settings";


/**
 * Visit targetUrl, wait for a few seconds.
 * Throw error.browserNavigationError if unable.
 */
export async function fetchUrl(targetUrl: string, proxy: Proxy): Promise<Response> {

    log.http(`Going to "${targetUrl}"`);
    let resp: Response;
    try {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), settings.fetchOptions.defaultTimeout);

        const agent = (proxy === undefined)
        ? null
        : new ProxyAgent(
            `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`
        );
        resp = await fetch(targetUrl, {
            agent: agent as any, // a dirty solution
            signal: controller.signal,
        });

    } catch (err) {
        log.warn(err.message);
        throw new error.FetchUrlError(targetUrl);
    }
    const logMessage = `Got ${resp.status} while trying to load "${targetUrl}"`;
    if (resp.status < 300) {
        log.http(logMessage);
    } else {
        log.notice(logMessage);
    }

    return resp;
}

/** */
export function parseDocument(pageText: string): libxmljs.Document {
    const document = libxmljs.parseHtml(pageText);
    return document;
}