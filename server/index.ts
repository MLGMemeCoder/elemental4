// Entry point, starts up all the services
import { startHTTPServer } from './server';
import { buildDocs } from './documentation';
import { initDatabase, generateDatabase } from './database';
import * as log from './logger';

log.info("Starting Elemental 4");

(async() => {
    // Setup backend stuff
    await Promise.all([
        initDatabase(),
        buildDocs(),
    ]);

    // Explose HTTP server
    startHTTPServer();
})();