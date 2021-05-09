import express from "express";
import compression from "compression";
import bodyParser from "body-parser";

import settings from "../util/settings";

// Controllers (route handlers)
import * as apiController from "../controllers/api";

// Create Express server
const app = express();

app.set("port", settings.cla.port);
app.use(compression());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

/**
 * API example routes.
 */
app.get("/example-call", apiController.exampleCall);

export default app;