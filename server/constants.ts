// Constants for the server to use.
import { join } from "path";
import * as dotenv from "dotenv";
import { readFileSync } from "fs";
import { IColorMap } from "../shared/api-1-types";

const env = dotenv.parse(readFileSync("./.env"));

/** RethinkDB Login */
export const RETHINK_LOGIN = {
    db: env.RETHINK_DB,
    host: env.RETHINK_HOST,
    port: parseInt(env.RETHINK_PORT),
};

/** Points to the folder with index.html and elemental.js */
export const GAME_OUTPUT_DIR = join(__dirname, "../../../game/out");
/** Points to index.html */
export const GAME_INDEX_HTML = join(__dirname, "../../../game/views/index.html");
/** Points to db-is-down.html */
export const GAME_NO_DB_HTML = join(__dirname, "../../../game/views/db-is-down.html");

/** HTTP port to run on, default 80 */
export const HTTP_PORT = parseInt(env.HTTP_PORT) || 80;
/** HTTPS port to run on, default 443 */
export const HTTPS_PORT = parseInt(env.HTTPS_PORT) || 443;

/** Location of the .pem file for HTTPS certification */
export const HTTPS_KEY = env.HTTPS_KEY;
/** Location of the .cert file for HTTPS certification */
export const HTTPS_CERT = env.HTTPS_CERT;

/** Color Data (colors.json) */
export const COLOR: IColorMap = JSON.parse(readFileSync("./game/colors.json").toString()).colors;

export const ENABLE_HTTP = env.ENABLE_HTTP === "true";
export const ENABLE_HTTPS = env.ENABLE_HTTPS === "true";
export const ENABLE_DATABASE = env.ENABLE_DATABASE === "true";
export const ENABLE_DOCS = env.ENABLE_DOCS === "true";