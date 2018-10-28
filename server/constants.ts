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

const minify = env.MINIFY_OUTPUT === "true";

/** Points to the folder with index.html and elemental.js */
export const GAME_OUTPUT_DIR = join(__dirname, "../../../game/out");
/** Points to index.html */
export const GAME_VIEWS_DIR = minify ? join(__dirname, "../../../game/views.min/") : join(__dirname, "../../../game/views/");
/** Points to pwa folder */
export const GAME_PWA_DIR = join(__dirname, "../../../game/pwa/");

/** Points to the res folder */
export const GAME_RES_FOLDER = join(__dirname, "../../../res");
/** Points to the robots.txt */
export const GAME_ROBOTS_TXT = join(__dirname, "../../../robots.txt");

export const IP_FOWARDING = env.IP_FOWARDING === "false" ? null : env.IP_FOWARDING;

/** How many votes until an elements get added. */
export const VOTES_TO_ADD_ELEMENT = parseInt(env.VOTES_TO_ADD_ELEMENT);

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

export const BASE_URL = 'elemental.davecode.me';
