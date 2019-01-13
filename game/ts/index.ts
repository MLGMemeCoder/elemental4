import { MDCRipple } from '@material/ripple';
import { initUIElementDragging, addUIElement } from './elem-ui';
import { loadElementDataBulk, getElementData, getElementDataCache, setGID } from './api-interface';
import { generateColorCSS } from './css-generator';
import { exposeGlobals } from './globals';
import { delay } from '../../shared/shared';
import { SetSoundPack } from './audio';
import { MountThemeCSS } from './theme';

window["$initgame"] = async($gID) => {
    delete window["$initgame"];
    console.log("👋 Hello Elemental");

    exposeGlobals();
    
    MountThemeCSS();

    let savefileraw: string = localStorage.getItem("S");
    let savefile: string[];
    if(savefileraw) savefile = savefileraw.split("S");
    else localStorage.S = "1S2S3S4";
    
    // Set a tagline at the top app bar.
    // const taglines = require("../taglines.json").elemental_taglines;
    // document.querySelector(".mdc-top-app-bar__subtext").innerHTML = arrayGetRandom(taglines);

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
};
