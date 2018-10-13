import { ElementColor } from "../../shared/api-1-types";

// Asserts some typing information
export function assertElementColor(string: string): ElementColor {
    if (string === "black"
        || string === "blue"
        || string === "brown"
        || string === "gray"
        || string === "green"
        || string === "lavender"
        || string === "lime"
        || string === "magenta"
        || string === "maroon"
        || string === "navy"
        || string === "olive"
        || string === "orange"
        || string === "pink"
        || string === "purple"
        || string === "red"
        || string === "silver"
        || string === "sky"
        || string === "tan"
        || string === "white"
        || string === "yellow") {
        return string;
    } else {
        throw new Error("TypeError: ElementColor expected. Got " + string);
    }
}