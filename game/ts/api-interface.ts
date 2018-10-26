import { ICombo, Stats, IElement, IComboWithElement, ISuggestionRequest } from "../../shared/api-1-types";

function hostReachable() {

    // Handle IE and more capable browsers
    var xhr = new XMLHttpRequest();

    // Open new request as a HEAD to the root hostname with a random param to bust the cache
    xhr.open("HEAD", "/ping?rand=" + Math.floor((1 + Math.random()) * 0x10000), false);

    // Issue request and handle response
    try {
        xhr.send();
        return (xhr.status >= 200 && (xhr.status < 300 || xhr.status === 304));
    } catch (error) {
        return false;
    }
}

/** Tracks message timings */
function requestTime(startTime: Date|number) {
    let now = new Date();
    let time = 0;
    if (typeof startTime === 'number') {
        time = now.getTime() - startTime;
    } else {
        time = now.getTime() - startTime.getTime();
    }

    if (time > 200) {
        console.warn('Request took ' + time + 'ms');
    } else {
        console.debug('Request took ' + time + 'ms');
    }

    return time;
}

/** preforms a fetch request, but will properly reconnect and show slow loading signs */
function request(input:string|Request,init?:RequestInit,fromFailed:boolean=false): Promise<Response> {
    let requestStartTime = new Date();
    return new Promise(done => {
        const promise = fetch(input,init);
        let overlay = fromFailed;
        const timer = setTimeout(() => {
            overlay = true;
            document.getElementById("loader").classList.remove("go-away");
        }, 115);
        
        promise.catch(async(error) => {
            document.getElementById("loader").classList.add("nointernet");
            if (error instanceof TypeError) {

                const interval = setInterval(async() => {
                    if(hostReachable()) {
                        clearInterval(interval);
                        done(await request(input,init,true));
                    }
                }, 5000);
            } else {
                let response = await request(input,init,true);
                // Calculate how long request took
                requestTime(requestStartTime);
                done(response);
            }
        });
        promise.then((resp) => {
            if(overlay) {
                document.getElementById("loader").classList.add("go-away");
                document.getElementById("loader").classList.remove("nointernet");
                clearTimeout(timer);
            } else {
                clearTimeout(timer);
            }
            // Calculate how long request took
            requestTime(requestStartTime);
            done(resp);
        })
    });
}

/** Storing elements so you dont have to ping the sever multiple times */
const elementCache: { [id: string]: IElement } = JSON.parse(localStorage.getItem("C")) || {};
const comboCache: {[combo:string]: IComboWithElement} = {};

const sentSuggestionCache = {};

/** Gets an element information, color and other data from is ID. */
export function getElementData(id: string): Promise<IElement> {
    // If we have it's data saved, return that.
    if (id in elementCache) {
        return Promise.resolve(elementCache[id]);
    }

    // Fetch some JSON data, and store it in the cache.
    return request("/api/v1/element/" + id).then(r => r.json()).then((element: any) => {
        elementCache[id] = element;
        localStorage.setItem("C", JSON.stringify(elementCache));
        return element[0];
    });
}
/** NOTE: Does not return elements, only loads them into cache. */
export async function loadElementDataBulk(id: string[]) {
    // Remove Everything we already have
    const lookups = id.filter(x => !(x in elementCache));
    if (lookups.length === 0) return;
    const fetchRes = await fetch("/api/v1/element/" + lookups.join(","));
    const output = await fetchRes.json();
    output.forEach((item: IElement) => {
        elementCache[item.id] = item;
    });
    localStorage.setItem("C", JSON.stringify(elementCache));
}
/** NOTE: Will throw an error if not in cache. */
export function getElementDataCache(id: string): IElement {
    // If we have it's data saved, return that.
    if (id in elementCache) {
        return elementCache[id];
    }
    throw new Error("Element Lookup not in Element Cache");
}

/** Get global statistics */
export function getStats(): Promise<Stats> {
    // Fetch the JSON at the api endpoint.
    return request("/api/v1/stats").then(r => r.json());
}

/** Get Combo */
export function getCombo(a: string, b: string): Promise<IComboWithElement|null> {
    // If we have it's data saved, return that.
    if (b < a) {
        let c = b;
        b = a;
        a = c;
    }
    const id = (a + "+" + b);
    if (id in elementCache) {
        return new Promise(x => x(comboCache[id]));
    }

    // Fetch some JSON data, and store it in the cache.
    return request("/api/v1/combo/" + id).then(r => r.text()).then((text) => {
        if (text === "null") {
            return null;
        }
        const combo = JSON.parse(text) as IComboWithElement;
        comboCache[id] = combo;
        elementCache[combo.result.id] = combo.result;
        localStorage.setItem("C", JSON.stringify(elementCache));
        return comboCache[id];
    });
}

export async function sendSuggestion(recipe: string, suggestion: ISuggestionRequest) {
    return fetch("/api/v1/suggestion/" + recipe,{
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Googleauth-Thingy': window["$gID"]
        },
        method: "POST",
        body: JSON.stringify(suggestion)
    }).then(r=>r.text());
}

export async function getSuggestions(recipe: string): Promise<ISuggestionRequest[]> {
    return fetch("/api/v1/suggestion/" + recipe).then(r => r.json());
}
