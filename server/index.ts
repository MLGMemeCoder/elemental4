// Entry point, starts up all the services
import { startHTTPServer } from './server';
import { buildDocs } from './documentation';
import { initDatabase, generateDatabase } from './database';
import * as log from './logger';

log.info("Starting Elemental 4");

(async() => {
    await initDatabase();
    await generateDatabase();
    await startHTTPServer();
    await buildDocs();
})();