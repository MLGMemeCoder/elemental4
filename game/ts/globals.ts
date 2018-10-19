/** Sets a global variable to stuff. */
export function exposeGlobals() {
    return;

    window["$ts"] = {
        api: require("./api-interface"),
        elem: require("./elem-ui"),
    };
}