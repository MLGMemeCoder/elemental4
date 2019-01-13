/** Sets a global variable to stuff. */
export function exposeGlobals() {
    window["$ts"] = {
        api: require("./api-interface"),
        elem: require("./elem-ui"),
        audio: require("./audio"),
        theme: require("./theme"),
    };
}