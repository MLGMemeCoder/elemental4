// Entry point, starts up all the services
import { startHTTPServer } from './server';
import { buildDocs } from './documentation';
import { initDatabase, generateDatabase } from './database';
import * as log from './logger';
import { ENABLE_DATABASE, ENABLE_HTTP, ENABLE_HTTPS } from './constants';

log.info("Starting Elemental 4");

(async() => {
    // Warn if anything is disabled
    if(!ENABLE_HTTP) log.warn("HTTP is disabled");
    if(!ENABLE_HTTPS) log.warn("HTTPS is disabled");
    if(!ENABLE_DATABASE) log.warn("Database is disabled");

    if(!ENABLE_HTTP
    || !ENABLE_HTTPS
    || !ENABLE_DATABASE)
        log.warn("Check .env for details.");

    // Setup backend stuff
    await initDatabase();

    // Start up HTTP and HTTPS server
    startHTTPServer();
})();
