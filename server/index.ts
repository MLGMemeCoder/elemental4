// Entry point, starts up all the services
import { startHTTPServer } from './server';
import { buildDocs } from './documentation';
import { initDatabase } from './element';

console.info("--- Starting Elemental 4 Server");

(async() => {
    await initDatabase();
    await startHTTPServer();
    await buildDocs();
})();