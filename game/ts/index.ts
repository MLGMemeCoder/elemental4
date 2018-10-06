import { arrayGetRandom } from '../../shared/shared';
import { MDCRipple } from '@material/ripple';
import { exposeGlobals } from './globals';
import { initUIElementDragging, addUIElement } from './elem-ui';
import { loadElementDataBulk, getElementData, getElementDataCache } from './api-interface';
import { generateColorCSS } from './css-generator';

document.addEventListener("DOMContentLoaded", async() => {
    console.log("👋 Hello Elemental");
    
    // Set a tagline at the top app bar.
    const taglines = require("../taglines.json").elemental_taglines;
    document.querySelector(".mdc-top-app-bar__subtext").innerHTML = arrayGetRandom(taglines);

    // Add ripples to elements defined in the main HTML File
    const allRipples = document.querySelectorAll(".ripple,.ripple-unbounded");
    allRipples.forEach((elem: HTMLElement) => {
        const ripple = new MDCRipple(elem);
        // alternale .ripple-unbounded makes unbounded = true
        if(elem.classList.contains('ripple-unbounded')) ripple.unbounded = true;
    });

    // Add the `mousemove` listener for moving elements
    initUIElementDragging();
    
    // Generate CSS from colors.json
    generateColorCSS();
    
    // Add the first four elements.
    const savefile = ["1","2","3","4"];
    await loadElementDataBulk(savefile);
    savefile.forEach(id => addUIElement(getElementDataCache(id)));

    // Expose global variables
    exposeGlobals();
});
