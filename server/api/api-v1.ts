// handles application program interface v1
import { Router } from 'express';
import { getElementData, getGameStats, getComboData, getComboSuggestions, suggestElement, databaseConnected, setElementNote } from '../database';
import { IComboWithElement } from '../../shared/api-1-types';
import { verifyGoogleToken } from '../googleapi';
import { arrayGetRandom } from '../../shared/shared';
import fetch from 'node-fetch';

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
                if(elem.createdUser) delete elem.createdUser;
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
        req.on("end", async () => {
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

                if(!req.headers['googleauth-thingy']) {
                    res.end("you never signed in");
                    return 
                }

                const user = await verifyGoogleToken(req.headers['googleauth-thingy'] as string);
                
                parse.display = parse.display.trim();
                parse.display = parse.display.replace(/\n|\r/g," ");
                parse.display = parse.display.replace(/<br *\/?>/g,"");
                parse.display = parse.display.replace(/  +/g," ");

                // if invalid
                if(!user) return res.end("you never signed in");
                
                const didTheyWin = await suggestElement(e1 + "+" + e2, parse, user);

                if(didTheyWin) {
                    res.end("you won the " + arrayGetRandom(["lottery","slot machine","electon","game"]));
                } else {
                    res.end("ok");
                }
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
    // Get Suggestions for a combo
    router.post("/api/v1/note/:query", async (req, res, next) => {
        if (!req.params.element) {
            return res.end("invalid");
        }
        const elem = await getElementData(req.params.element);
        if(elem) {
            if (!req.headers['googleauth-thingy']) {
                res.end("you never signed in");
                return
            }

            const user = await verifyGoogleToken(req.headers['googleauth-thingy'] as string);

            // if invalid
            if (!user) return res.end("you never signed in");

            if (user!==elem.createdUser) return res.end("you didnt make this one ok.")

            let data = "";
            req.on("data", (chunk) => {
                data += chunk;
                if (data.length > 3000) throw new TypeError("Thats a big string O_o. Request Denied");
            });
            req.on("end", async () => {
                await setElementNote(elem.id, data);
                res.end("ok");
            });
        }
        res.end("ok");
    });
    router.get("/api/v1/search-package/audio", (req,res) => {
        let url = req.headers["x-package"];
        if (typeof url === "string") {
            fetch(url)
            .then(res => res.json())
            .then(json => {
                if(!(json.name && typeof json.name === "string")) {
                    res.send({ error: "The Sound Pack does is not formatted correctly." });
                    return;
                }
                if (!(json.sounds && typeof json.sounds === "object")) {
                    res.send({ error: "The Sound Pack does is not formatted correctly." });
                    return;
                }
                if (Object.keys(json.sounds).some((sound) => {
                    if (typeof json.sounds[sound] !== "string") {
                        res.send({ error: "The Sound Pack does is not formatted correctly." });
                        return true;
                    } else return false;
                })) return;
                res.send({
                    error:"success",
                    pack: {
                        name: json.name,
                        sounds: json.sounds
                    }
                });
            })
            .catch(x=>{
                res.send({ error: "The Sound Pack could not be found."});
            });
        } else {
            res.send({ error:"Request Invalid"});
        }
    });

    return router;
}