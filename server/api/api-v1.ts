// handles application program interface v1
import { Router } from 'express';
import { getElementData, getGameStats, getComboData, writeElement, writeCombo, getComboSuggestions, suggestElement, databaseConnected } from '../database';
import { IComboWithElement } from '../../shared/api-1-types';
import { createHash } from 'crypto';

/** API Router v1 */
export = function() {
    const router = Router();

    router.use((req,res,next) => {
        // if servers are down, report an error
        if(!req.url.startsWith("/api/v1")) return next();
        if(databaseConnected) return next();

        res.statusCode = 503;
        res.send({error: "Databases Down!"});
    });

    // Get Element
    router.get("/api/v1/element/:element", async(req, res, next) => {
        if (!req.params.element) {
            return res.end("invalid");
        }
        const query = req.params.element.split(",");
        res.write("[");
        for (let i = 0; i < query.length; i++) {
            const id = query[i];
            const elem = await getElementData(id);
            if (elem) {
                res.write(JSON.stringify(elem));
            } else {
                res.write("null");
            }
            if(i < query.length - 1) {
                res.write(",");
            }
        }
        res.end("]");
    });
    // Get Combo
    router.get("/api/v1/combo/:query", async(req, res, next) => {
        let e1 = req.params.query.split("+")[0];
        let e2 = req.params.query.split("+")[1];

        if (e1.includes("..")) return next();
        if (e2.includes("..")) return next();
        if (e2 < e1) {
            let c = e2;
            e2 = e1;
            e1 = c;
        }

        const elem = await getComboData(e1, e2);
        if(elem) {
            res.send({
                recipe: e1 + "+" + e2,
                result: await getElementData(elem.result)
            } as IComboWithElement);
        } else {
            res.end("null");
        }
    });
    // Global Stats
    router.get("/api/v1/stats", async(req, res, next) => {
        res.send(await getGameStats());
    });
    // Post New Elements
    router.post("/api/v1/suggestion/:query", async (req, res, next) => {
        let e1 = req.params.query.split("+")[0];
        let e2 = req.params.query.split("+")[1];

        if (e1.includes("..")) return next();
        if (e2.includes("..")) return next();
        if (e2 < e1) {
            let c = e2;
            e2 = e1;
            e1 = c;
        }

        // get and veryify post request
        // writeSuggestion it
        let data = "";
        req.on("data", (chunk) => {
            data += chunk;
            if(data.length>1000) throw new TypeError("Thats a big string O_o. Request Denied");
        });
        req.on("end", () => {
            try {
                const parse = JSON.parse(data);
                if ((parse === null) || (parse === undefined)
                    || ((typeof parse) !== "object")
                    || ((typeof parse.display) !== "string")
                    || ((typeof parse.color) !== "string")
                    || (parse.display.length > 25)
                ) {
                    res.statusCode = 400;
                    res.end("400");
                    return;
                }
                
                const ip = createHash('sha256').update(req.connection.remoteAddress).digest('base64')

                suggestElement(e1 + "+" + e2, parse, ip);

                res.end("sent");
            } catch (error) {
                res.statusCode = 400;
                res.end("400");
            }
        });
    });
    // Get Suggestions for a combo
    router.get("/api/v1/suggestion/:query", async (req, res, next) => {
        let e1 = req.params.query.split("+")[0];
        let e2 = req.params.query.split("+")[1];

        if (e1.includes("..")) return next();
        if (e2.includes("..")) return next();
        if (e2 < e1) {
            let c = e2;
            e2 = e1;
            e1 = c;
        }

        const suggestions = await getComboSuggestions(e1, e2);
        if (suggestions) {
            const r = suggestions.results.map(r => r.variants.map(v => ({color:v.color, display: v.display})));    
            res.send(r.reduce((prev, next) => prev.concat(next), []));
        } else {
            res.send([]);

        }
    });

    return router;
}