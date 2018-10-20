import { MDCRipple } from '@material/ripple';
import { MDCSnackbar } from '@material/snackbar';
import { getCombo, getElementData, getElementDataCache, sendSuggestion, getSuggestions } from "./api-interface";
import { IElement } from '../../shared/api-1-types';
import { delay, arrayGet3Random } from '../../shared/shared';
import { assertElementColor } from './assert';

export const elements: { [id: string]: { dom: HTMLElement, elem: IElement} } = {};
let held_element: null | string = null;
let offsetX, offsetY;

let fadedElement: HTMLElement | undefined;
let elemContainer: HTMLElement;

let elementinfo: HTMLElement;

let suggestRecipe = '';
export async function showSuggestDialog(e1: string, e2: string) {
    const elem = document.querySelector("#suggest-elem-container");
    elem.classList.add("visible");
    const recipeElem = document.querySelectorAll(".elements-to-combine .element");
    const e1e = getElementDataCache(e1);
    const e2e = getElementDataCache(e2);
    recipeElem[0].innerHTML = e1e.display;
    recipeElem[1].innerHTML = e2e.display;
    
    recipeElem[0].className = "element " + e1e.color;
    recipeElem[1].className = "element " + e2e.color;

    suggestRecipe = e1 + "+" + e2;

    document.querySelector(".suggestelement").className = "suggestelement white";
    document.querySelector(".suggestelement").innerHTML = "Your Element";

    document.getElementById("suggestother1").parentElement.classList.add("non-visible");
    document.getElementById("suggestother2").parentElement.classList.add("non-visible");
    document.getElementById("suggestother3").parentElement.classList.add("non-visible");
    const suggestions = arrayGet3Random(await getSuggestions(suggestRecipe));
    
    if(suggestions[0]) {
        const elem = document.getElementById("suggestother1");
        elem.innerHTML = suggestions[0].display;
        elem.className = "element " + suggestions[0].color;
        elem.parentElement.classList.remove("non-visible")
    }
    if(suggestions[1]) {
        const elem = document.getElementById("suggestother2");
        elem.innerHTML = suggestions[1].display;
        elem.className = "element " + suggestions[1].color;
        elem.parentElement.classList.remove("non-visible")
    }
    if(suggestions[2]) {
        const elem = document.getElementById("suggestother3");
        elem.innerHTML = suggestions[2].display;
        elem.className = "element " + suggestions[2].color;
        elem.parentElement.classList.remove("non-visible")
    }
}

function cursor(state: boolean) {
    document.getElementById("element-container")
        .classList[state ? "add" : "remove"]("is-dragging-elem");
}

async function processCombo(src: string, dest: string) {
    const combo = await getCombo(src, dest);
    if(combo) {
        addUIElement(await getElementData(combo.result.id), dest);
    } else {
        // dont
        showSuggestDialog(src,dest);
    }
}

async function moveback() {
    cursor(false);
    const dom = elements[held_element].dom;
    held_element = null;

    dom.classList.add("moveback");
    dom.classList.remove("is-held");

    await delay(2);
    dom.style.transform = "";
    dom.style.left = "";
    dom.style.top = "";

    await delay(350);
    dom.classList.remove("moveback");
    if (fadedElement) fadedElement.remove();
    elementinfo.classList.add("showtooltip");
}
async function shinkback() {
    cursor(false);
    const dom = elements[held_element].dom;
    held_element = null;

    fadedElement.classList.add("faded-element-fade");
    fadedElement.classList.remove("faded-element");

    dom.classList.add("moveback");
    dom.classList.remove("is-held");

    await delay(2);
    dom.style.transform = "scale(0.5)";
    dom.style.opacity = "0.0";
    // dom.style.left = "";
    // dom.style.top = "";
    
    await delay(350);
    dom.classList.remove("moveback");
    dom.style.transform = "";
    dom.style.opacity = "";
    dom.style.left = "";
    dom.style.top = "";
    if (fadedElement) fadedElement.remove();
    elementinfo.classList.add("showtooltip");
}

export async function addUIElement(elem: IElement, srcElem?: string) {
    if (srcElem) {
        let movingelem = document.createElement("div");
        movingelem.classList.add("element");
        movingelem.classList.add(elem.color); // classes have the color id names.
        movingelem.innerHTML = elem.display;
        elemContainer.appendChild(movingelem);
        
        const dom = elements[srcElem].dom;
        let xx;
        let yy;
        let animatingSiblingCatagory = null;

        if (elem.id in elements) {
            xx = elements[elem.id].dom.offsetLeft;
            yy = elements[elem.id].dom.offsetTop;
        } else {
            let catagory = document.querySelector(".catagory.catagory-" + elem.color) as HTMLElement;
            let yy2 = 0;
            if (catagory) {
                yy2 = (catagory.lastElementChild as HTMLElement).offsetTop
                catagory.appendChild(movingelem);
            }
            xx = movingelem.offsetLeft;
            yy = movingelem.offsetTop;
            if (catagory && yy > yy2) {
                animatingSiblingCatagory = catagory.nextElementSibling as HTMLElement;
                animatingSiblingCatagory.style.transition = "padding-top 200ms";
                animatingSiblingCatagory.style.paddingTop = "89px";
            }
        }

        movingelem.style.position = "absolute";
        movingelem.style.left = (dom.offsetLeft) + "px";
        movingelem.style.top = (dom.offsetTop) + "px";
        movingelem.style.opacity = "0";
        movingelem.style.transform = "scale(0.5)";

        await delay(10);
        
        movingelem.classList.add("fakemoveanimation");
        
        await delay(10);

        movingelem.style.opacity = "1";
        movingelem.style.transform = "scale(1.3)";
        
        await delay(500);
        
        movingelem.style.left = xx + "px";
        movingelem.style.top = yy + "px";
        
        movingelem.style.transform = "scale(1)";

        await delay(350);
        movingelem.classList.add("e2");
        if (animatingSiblingCatagory) animatingSiblingCatagory.style.transition = "";
        
        await delay(150);
        
        if (elem.id in elements) {
            movingelem.style.opacity = "0";
            await delay(500);
        };
        if (animatingSiblingCatagory) animatingSiblingCatagory.style.paddingTop = "";
        movingelem.remove();
    }
    // Verify element doesnt already exist.
    if(elem.id in elements) return;

    // Add the element's dom.
    const dom = document.createElement("div");
    dom.classList.add("element");
    dom.classList.add(elem.color); // classes have the color id names.
    elements[elem.id] = {
        dom,
        elem
    };

    // save
    localStorage.setItem("S", Object.keys(elements).join("S"));

    dom.classList.add("moveback");
    if(!srcElem) {
        dom.style.transform = "scale(0.5)";
        dom.style.opacity = "0.0";
    }

    // Handle movement on elements
    dom.addEventListener("click", async (ev) => {
        if(held_element) {
            processCombo(held_element, elem.id);
            shinkback();
            return;
        }
        await delay(1);
        cursor(true);
        elementinfo.classList.remove("showtooltip");
        
        fadedElement = document.createElement("div");
        fadedElement.classList.add("element");
        fadedElement.classList.add("faded-element");
        fadedElement.classList.add(elem.color); // classes have the color id names.
        fadedElement.innerHTML = elem.display;
        elemContainer.appendChild(fadedElement);

        fadedElement.addEventListener("click", (ev) => {
            if(held_element)
                processCombo(held_element, held_element);
            shinkback();
        });

        held_element = elem.id;

        const bodyRect = document.body.getBoundingClientRect(),
            elemRect = dom.getBoundingClientRect();
        offsetY = elemRect.top - bodyRect.top + 75 / 2;
        offsetX = elemRect.left - bodyRect.left + 75 / 2;

        fadedElement.style.left = dom.offsetLeft + "px";
        fadedElement.style.top = dom.offsetTop + "px";

        dom.classList.add("moveback");
        dom.classList.add("is-held");

        dom.style.transform = "scale(0.8)";
        dom.style.left = (ev.clientX - offsetX) + "px";
        dom.style.top = (ev.clientY - offsetY) + "px";

        await delay(200);
        dom.classList.remove("moveback");
    });

    let catagory = document.querySelector(".catagory.catagory-" + elem.color);
    if(!catagory) {
        catagory = document.createElement("div");
        catagory.className = "catagory catagory-" + elem.color
        elemContainer.appendChild(catagory);
    }
    catagory.appendChild(dom);
    MDCRipple.attachTo(dom);
    dom.innerHTML = elem.display;

    await delay(10);
    
    dom.style.transform = "";
    dom.style.opacity = "";

    await delay(300);
    dom.classList.remove("moveback");
}
export function initUIElementDragging() {
    window.addEventListener("mousemove", (ev) => {
        if(!held_element) return;
        
        const xx = (ev.clientX - offsetX);
        const yy = (ev.clientY - offsetY) + document.scrollingElement.scrollTop;
        
        const style = getComputedStyle(elemContainer);
        
        parseFloat(style.paddingTop) * 2 + 80

        const dom = elements[held_element].dom;

        dom.style.left = Math.min(xx, window.innerWidth - (parseFloat(style.paddingLeft) + 75)) + "px";
        dom.style.top = Math.min(yy, window.innerHeight - (parseFloat(style.paddingTop) + 80)) + "px";
    });
    window.addEventListener("click", async(ev) => {
        if (!(ev.target as HTMLElement).classList.contains("element")
        && held_element) {
            if (!elements[held_element].dom.classList.contains("moveback"))
            moveback();
        }
    })
    window.addEventListener("keydown", async(ev) => {
        if (ev.keyCode == 27) {
            if (held_element && !elements[held_element].dom.classList.contains("moveback")) {
                moveback();
                return;
            }

            const elem = document.querySelector("#suggest-elem-container");
            elem.classList.remove("visible");
        }
    });
    elemContainer = document.getElementById("element-container");

    const suggestElemEnter = document.querySelector(".suggestelement");
    suggestElemEnter.addEventListener("blur", () => {
        window.getSelection().removeAllRanges()
    });
    const colorPickerColors = document.querySelectorAll(".color");
    colorPickerColors.forEach(elem => {
        const color = Array.from(elem.classList).filter(x => x !== "color")[0];
        elem.addEventListener("click", () => {
            suggestElemEnter.className = "suggestelement " + color;
        });
        MDCRipple.attachTo(elem);
    });

    
    const submitElement = document.querySelector("#submit-your-element");
    const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
    
    MDCRipple.attachTo(submitElement);
    submitElement.addEventListener("click", () => {
        const elem = document.querySelector("#suggest-elem-container");
        const start_time = Date.now();
        elem.classList.remove("visible");
        const color = document.querySelector('.suggestelement').className.substr(15)
        sendSuggestion(suggestRecipe, {
            display: document.querySelector('.suggestelement').innerHTML,
            color: assertElementColor(color)
        }).then((r) => {
            if(r === "sent") {
                setTimeout(() => {
                    snackbar.show({
                        message: "Suggestion Sent!",
                        timeout: 1750,
                    });
                }, 500 - (Date.now() - start_time));
            }
        });
    });

    document.querySelectorAll(".downvote").forEach(elem => {
        const ripple = new MDCRipple(elem);
        ripple.unbounded = true;
    });

    let contentEditableNodes = document.querySelectorAll('[contenteditable]');
    if((() => {
        let d = document.createElement("div");
        try {
            d.contentEditable = "PLAINtext-onLY";
        } catch(e) {
            return false;
        }
        return d.contentEditable == "plaintext-only";
    })()) {
        // contenteditble=plaintext-only is supported
        console.debug("[contenteditble=plaintext-only] is supported");
        [].forEach.call(contentEditableNodes, function(div) {
            div.contentEditable = "plaintext-only";
        });
    } else {
        console.debug("[contenteditble=plaintext-only] is not supported");
        // contenteditble=plaintext-only is not supported
        [].forEach.call(contentEditableNodes, function(div) {
            div.addEventListener("paste", function(e) {
                // cancel paste
                e.preventDefault();
                
                // get text representation of clipboard
                var text = e.clipboardData.getData("text/plain");
                
                // insert text manually
                document.execCommand("insertHTML", false, text);
            });
        });
    }
    elementinfo = document.querySelector(".element-info");
    new MDCRipple(elementinfo).unbounded = true;
}