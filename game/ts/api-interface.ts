import { ICombo, Stats, IElement, IComboWithElement } from "../../shared/api-1-types";

/** Storing elements so you dont have to ping the sever multiple times */
const elementcache: {[id:string]: IElement} = {

};
const combocache: {[combo:string]: IComboWithElement} = {};

/** Gets an element information, color and other data from is ID. */
export function getElementData(id: string): Promise<IElement> {
    // If we have it's data saved, return that.
    if (id in elementcache) {
        return new Promise(x => x(elementcache[id]));
    }

    // Fetch some JSON data, and store it in the cache.
    return fetch("/api/v1/element/" + id).then(r => r.json()).then((element: any) => {
        elementcache[id] = element;
        return element[0];
    });
}
/** NOTE: Does not return elements, only loads them into cache. */
export async function loadElementDataBulk(id: string[]) {
    // Remove Everything we already have
    const lookups = id.filter(x => !(x in elementcache));
    const fetchRes = await fetch("/api/v1/element/" + lookups.join(","));
    const output = await fetchRes.json();
    output.forEach((item: IElement) => {
        elementcache[item.id] = item;
    });
}
/** NOTE: Will throw an error if not in cache. */
export function getElementDataCache(id: string): IElement {
    // If we have it's data saved, return that.
    if (id in elementcache) {
        return elementcache[id];
    }
    throw new Error("Element Lookup not in Element Cache");
}

/** Get global statistics */
export function getStats(): Promise<Stats> {
    // Fetch the JSON at the api endpoint.
    return fetch("/api/v1/stats").then(r => r.json());
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
    if (id in elementcache) {
        return new Promise(x => x(combocache[id]));
    }

    // Fetch some JSON data, and store it in the cache.
    return fetch("/api/v1/combo/" + id).then(r => r.text()).then((text) => {
        if (text === "null") {
            return null;
        }
        const combo = JSON.parse(text) as IComboWithElement;
        combocache[id] = combo;
        elementcache[combo.result.id] = combo.result;
        return combocache[id];
    });
}