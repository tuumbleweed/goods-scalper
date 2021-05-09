
import { Response, Request } from "express";

import settings from "../util/settings";
import * as error from "../util/error";
import log from "../util/logger";


function errorHandle(err: Error, res: Response) {
    log.error(err.message);
    error.rollbar.error(err);
    const errMsg = settings.PRODUCTION ? "Internal Server Error" : err.message;
    return createResponse(res, 500, errMsg, "error");
}

function createResponse(
    res: Response, statusCode: number, message: unknown, type: string
): Response<any> { // eslint-disable-line @typescript-eslint/no-explicit-any
    return res.status(statusCode).send({ [type]: message });
}

export async function exampleCall(req: Request, res: Response): Promise<Response> {
    try {
        log.http(
            `${req.url}, ra: ${req.connection.remoteAddress.replace(/^.*:/, "")},`
            + ` t: ${req.headers.token}, c: ${req.headers.container}`
        );
        if (req.headers.token !== settings.secret.apiToken) {
            return createResponse(res, 403, "Access denied", "error");
        }

        const param = req.query.param;
        if (typeof param !== "string") {
            return createResponse(res, 422, "Parameter param is missing", "error");
        }

        return createResponse(res, 200, "exampleCall", "response");
    } catch (err) { return errorHandle(err, res); }
}