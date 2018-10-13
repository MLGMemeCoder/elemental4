// Shared library functions
/** Returns a random element in the array. */
export function arrayGetRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}
/** Returns three random values from an array, unique */
export function arrayGet3Random<T>(arr: T[]): T[] {
    if(arr.length < 4) return arr;

    const a = Math.floor(Math.random() * arr.length);
    let b = a;
    while(b === a) {
        b = Math.floor(Math.random() * arr.length);
    }
    let c = a;
    while(c === b || c === a) {
        c = Math.floor(Math.random() * arr.length);
    }

    return [
        arr[a],
        arr[b],
        arr[c]
    ]
}
/** Converts element name to an ID */
export function elementNameToStorageID(elemName: string): string {
    return elemName.replace(/[^A-Za-z]/g, "").toLowerCase();
}
/** Returns a promise that resolves after a timeout */
export function delay(ms: number) {
    return new Promise(r => setTimeout(r, ms));
}
