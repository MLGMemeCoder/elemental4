// Handles serving front end static pages
// and routing api calls.
import { HTTP_PORT, GAME_OUTPUT_DIR, GAME_INDEX_HTML } from "./constants";
import * as express from 'express';
import { documentationRouter } from "./documentation";

export let app: express.Express;
export function startHTTPServer() {
    app = express();
    
    // Remove Express Header
    app.use((req,res,next) => {
        res.removeHeader("X-Powered-By");
        next();
    });

    // Add static stuff
    app.use(express.static(GAME_OUTPUT_DIR));
    app.get('/', (r,res) => res.sendFile(GAME_INDEX_HTML))

    // Add api calls
    app.use(require("./api/api-v1")());

    // Docs
    app.use(documentationRouter());
    
    // Listen on the port
    app.listen(HTTP_PORT, () => {
        console.info("HTTP server started. http://localhost:" + HTTP_PORT);
    });
}