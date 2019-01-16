import { MDCRipple } from '@material/ripple';
import { initUIElementDragging, addUIElement } from './elem-ui';
import { loadElementDataBulk, getElementData, getElementDataCache, setGID, getStats } from './api-interface';
import { generateColorCSS } from './css-generator';
import { exposeGlobals } from './globals';
import { SetSoundPack } from './audio';
import { MountThemeCSS, SetTheme } from './theme';

const packageJSON = require("../../package.json");

declare const $version: string;

window["$initgame"] = async($gID) => {
    delete window["$initgame"];
    console.log("👋 Hello Elemental");
    
    exposeGlobals();

    // check for updates
    if ((await getStats()).version !== packageJSON.version) {
        // going to have to reload with new content
        localStorage.removeItem("CC");
        localStorage.CC_IS_UPDATING = "true";
        if (location.href.endsWith("/#") || location.href.endsWith("/")) {
            history.replaceState("", document.title, "#game");
        }

        location.reload();
        return;
    }
    
    let savefileraw: string = localStorage.getItem("S");
    let savefile: string[];
    if (savefileraw) savefile = savefileraw.split("S");
    else localStorage.S = "1S2S3S4";
    
    // Add ripples to elements defined in the main HTML File
    const allRipples = document.querySelectorAll(".ripple,.ripple-unbounded");
    allRipples.forEach((elem: HTMLElement) => {
        const ripple = new MDCRipple(elem);
        // alternale .ripple-unbounded makes unbounded = true
        if(elem.classList.contains('ripple-unbounded')) ripple.unbounded = true;
    });
    
    // Generate CSS from colors.json
    generateColorCSS();
 
    // tell api the GID
    setGID($gID);

    // Add the `mousemove` listener for moving elements
    initUIElementDragging();
    
    // Add the first four elements.
    if(!savefile) savefile = ["1","2","3","4"];
    
    await loadElementDataBulk(savefile);
    
    for (const id of savefile) {
        addUIElement(getElementDataCache(id));
    }

    SetSoundPack(localStorage.audioprofile_selected);
    SetTheme(localStorage.theme_selected);
    
    MountThemeCSS();
};
