const colordata = require("../colors.json");
export function generateColorCSS() {
    const css = Object.keys(colordata.colors).map(key => {
        return `
        .${key}{background-color: ${colordata.colors[key]}${colordata.light_colors.includes(key) ?";color:rgba(0, 0, 0, 0.95);":""}}`;
    }).join("");
    const style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);
}