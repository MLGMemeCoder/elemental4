// Handles serving front end static pages
// and routing api calls.
import { HTTP_PORT, GAME_OUTPUT_DIR, GAME_INDEX_HTML, GAME_NO_DB_HTML, HTTPS_KEY, HTTPS_CERT, HTTPS_PORT, ENABLE_HTTP, ENABLE_HTTPS, GAME_MENU_HTML, GAME_RES_FOLDER, GAME_ROBOTS_TXT } from "./constants";
import * as express from 'express';
import { documentationRouter } from "./documentation";
import * as log from './logger';
import { databaseConnected } from "./database";
import { createServer as createHTTPServer } from 'http';
import { createServer as createHTTPSServer, ServerOptions } from 'https';
import { readFileSync } from "fs";

export let app: express.Express;
export function startHTTPServer() {
    app = express();
    
    // Remove Express Header
    app.use((req,res,next) => {
        res.removeHeader("X-Powered-By");
        next();
    });

    // Add static stuff
    app.use(express.static(GAME_OUTPUT_DIR, {
        maxAge: '1d'
    }));

    app.get('/game', (r,res) => {
        if(databaseConnected) {
            res.sendFile(GAME_INDEX_HTML)
        } else {
            res.statusCode = 307;
            res.setHeader("Location", "/");
            res.end();
        }
    });
    app.get('/', (r,res) => {
        if(databaseConnected) {
            res.sendFile(GAME_MENU_HTML);
        } else {
            res.statusCode = 503;
            res.sendFile(GAME_NO_DB_HTML);
        }
    });
    app.get('/ping', (r,res) => res.send("pong"));

    // Add api calls
    app.use(require("./api/api-v1")());

    // Docs
    app.use(documentationRouter());
    
    // Res
    var res_static = express.static(GAME_RES_FOLDER, {
        maxAge: '1d'
    });
    app.get('/res/*', (req,res,next) => {
        // block some file types
        if(req.url.endsWith(".afdesign")) return next();

        req.url = req.url.substring(4);        
        res_static(req, res, next);
    });

    app.get('/robots.txt', (req,res) => res.sendFile(GAME_ROBOTS_TXT))


    // Create an HTTP service.
    if (ENABLE_HTTP) {
        createHTTPServer(app).listen(HTTP_PORT, () => {
            log.info("HTTP server started. http://localhost:" + HTTP_PORT);
        });
    }
    
    // Create an HTTPS service identical to the HTTP service.
    if (ENABLE_HTTPS) {
        const httpsOptions: ServerOptions = {
            key: readFileSync(HTTPS_KEY),
            cert: readFileSync(HTTPS_CERT),
        }
        createHTTPSServer(httpsOptions, app).listen(HTTPS_PORT, () => {
            log.info("HTTPS server started. https://localhost:" + HTTPS_PORT);
        });
    }
}