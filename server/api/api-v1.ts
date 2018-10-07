// handles application program interface v1
import { Router } from 'express';
import { getElementData, getGameStats, getComboData, writeElement, writeCombo, getComboSuggestions, suggestElement } from '../database';
import { IComboWithElement } from '../../shared/api-1-types';

/** API Router v1 */
export = function() {
    const router = Router();

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
        });
        req.on("end", () => {
            try {
                const parse = JSON.parse(data);
                if ((parse === null)
                    || ((typeof parse) !== "object")
                    || ((typeof parse.display) !== "string")
                    || ((typeof parse.color) !== "string")
                ) {
                    res.statusCode = 400;
                    res.end("400");
                    return;
                }
                suggestElement(e1 + "+" + e2, parse, req.ip);
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

        res.send(await getComboSuggestions(e1, e2));
    });

    return router;
}