// Shared library functions
/** Returns a random element in the array. */
export function arrayGetRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}
/** Converts element name to an ID */
export function elementNameToStorageID(elemName: string): string {
    return elemName.replace(/[^A-Za-z]/g, "").toLowerCase();
}
/** Returns a promise that resolves after a timeout */
export function delay(ms: number) {
    return new Promise(r => setTimeout(r, ms));
}
