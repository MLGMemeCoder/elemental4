// Handles serving front end static pages
// and routing api calls.
import { HTTP_PORT, GAME_OUTPUT_DIR, HTTPS_KEY, HTTPS_CERT, HTTPS_PORT, ENABLE_HTTP, ENABLE_HTTPS, GAME_RES_FOLDER, GAME_ROBOTS_TXT, GAME_VIEWS_DIR, GAME_PWA_DIR } from "./constants";
import * as express from 'express';
import * as log from './logger';
import { databaseConnected } from "./database";
import { createServer as createHTTPServer } from 'http';
import { createServer as createHTTPSServer, ServerOptions } from 'https';
import { readFileSync } from "fs";
import { join } from "path";

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
    app.use(express.static(GAME_PWA_DIR));

    app.get('/', (r,res) => {
        if(databaseConnected) {
            res.sendFile(join(GAME_VIEWS_DIR, "menu.html"));
        } else {
            res.statusCode = 503;
            res.sendFile(join(GAME_VIEWS_DIR, "menu-down.html"));
        }
    });
    app.get('/ping', (r,res) => res.send("pong"));

    // Add api calls
    app.use(require("./api/api-v1")());

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
    app.get('/game.html', (req, res) => res.sendFile(join(GAME_VIEWS_DIR, "game.html")))
    app.get('/offline.html', (req, res) => res.sendFile(join(GAME_VIEWS_DIR, "offline.html")))

    // Create an HTTP service.
    if (ENABLE_HTTP) {
        if(ENABLE_HTTPS) {
            // redirectify
            createHTTPServer((req, res) => {
                const host = req.headers["host"];
                const url = "https://" + host + req.url;
                res.statusCode = 302;
                res.setHeader("Location", url);
                res.end("Moved to <a href='" + url + "'>" + url + "</a>");
            }).listen(HTTP_PORT, () => {
                log.info("HTTP server started (Redirecting to HTTPS). http://localhost:" + HTTP_PORT);
            });
        } else {
            // make the server on http
            createHTTPServer(app).listen(HTTP_PORT, () => {
                log.info("HTTP server started. http://localhost:" + HTTP_PORT);
            });
        }
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