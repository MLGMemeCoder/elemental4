// manages themes
if (!localStorage.themelist) {
    localStorage.themelist = JSON.stringify([]);
}
if (!localStorage.theme_selected) {
    localStorage.theme_selected = "Light";
}
let packid = localStorage.theme_selected;
let themes: Array<any> = JSON.parse(localStorage.getItem("themelist"));


const buildin_themes = [
    {
        name: "Light",
        css: ``,
    },
    {
        name: "Dark",
        css: [
            "body.game{background:#222;color:#FFF}",
            ".elem-info-panel,.settings{background:#191919;}",
            ".close{color:white;}",
            ".resetgame{background:#e01414;}",
            ".add-custom-btn{background:#ca119f}",
            ".mdc-button--raised:not(:disabled){background:#EEE;color:#000}",
            ".mdc-button--raised:disabled,.mdc-button--unelevated:disabled{background-color:rgba(255,255,255,0.12);color:rgba(255,255,255,0.37);}",
            "#suggest-elem{background:##3e3e3ef5}",
            ".sperator{background:#FFF}",
            "body.game header{background:#171717}",
            "#total-counter{color:#FFF}",

            ".mdc-button--raised::before, .mdc-button--raised::after, .mdc-button--unelevated::before, .mdc-button--unelevated::after {background-color: var(--mdc-theme-on-primary, #000);}",
            ".close::before, .close::after {background-color: #FFF;}",
            ".settings-btn::before, .settings-btn::after {background-color: #FFF;}",
            ".element-info::before, .element-info::after {background-color: #FFF;}",

            ".lime{background:#62d204}",
            ".maroon{background:#9a1414}",
            ".red{background:#dc2a27}",
            ".white{background:#f7f7f7}",
            ".lavender{background:#966de0}",
            ".purple{background:#973cbd}",
            ".orange{background:#f35d2e}",
            ".yellow{background:#e8d955}",
            ".magenta{background:#c733e0}",
            ".pink{background:#fb6296}",
            ".sky{background:#84c0f3}",
            ".navy{background:#263bc3}",
            ".tan{background:#9a7466}",
        ].join("")
    }
];

export function getThemeList() {
    return [
        ...themes,
        ...buildin_themes,
    ];
}

function getCSS() {
    return getThemeList().find(x => x.name === packid).css;
}

const style = document.createElement("style");
style.innerHTML = getCSS();

export function SetTheme(id) {
    packid = id;
    document.getElementById("theme-pack-menu-btn").innerHTML = "Theme: " + id;
    localStorage.theme_selected = id;
    style.innerHTML = getCSS();
}

export function AddTheme(pack) {
    themes = themes.filter(x => x.name !== pack.name);
    themes.push(pack);
    SetTheme(pack.name);
    localStorage.themelist = JSON.stringify(themes);
}

export function RemoveTheme() {
    if (packid === name) {
        SetTheme("Light");
    }
    themes = themes.filter(x => x.name !== name);
    localStorage.themelist = JSON.stringify(themes);
}

export function MountThemeCSS() {
    document.head.appendChild(style);
}