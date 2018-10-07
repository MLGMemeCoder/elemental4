// Constants for the server to use.
import { join } from "path";
import * as dotenv from "dotenv";
import { readFileSync } from "fs";

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
