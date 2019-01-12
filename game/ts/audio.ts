type AUDIO_ID = "discover-new" | "discover-old" | "discover-nothing" | "pickup" | "drop" | "woosh";
type SOUND_PACK = "default" | "classic";

let packid: SOUND_PACK = "default";
const sounds: { [pack: string]: { [name: string]: HTMLAudioElement } } = {};
function PreloadSound(pack: SOUND_PACK, id: AUDIO_ID, url: string) {
    if (!sounds[pack]) sounds[pack] = {};
    sounds[pack][id] = new Audio(url);
    sounds[pack][id].load();
    sounds[pack][id].onerror = () => {};
}

export function PlaySound(id: AUDIO_ID) {
    if (!sounds[packid][id]) {
        console.warn("No sound for " + id);
        return;
    }
    sounds[packid][id].play();
}

export function SetSoundPack(id: SOUND_PACK) {
    packid = id;
}

PreloadSound("default", "discover-new", "/res/aud/default/discover-new.mp3");

PreloadSound("classic", "discover-new", "/res/aud/classic/discover-new.mp3");
PreloadSound("classic", "discover-old", "/res/aud/classic/discover-old.mp3");
PreloadSound("classic", "discover-nothing", "/res/aud/classic/discover-nothing.mp3");
