type AUDIO_ID = "discover-new" | "discover-old" | "discover-nothing" | "pickup" | "drop" | "woosh";

const sounds: {[name: string]: HTMLAudioElement} = {};
function PreloadSound(url: string, id: AUDIO_ID) {
    sounds[id] = new Audio(url);
}

export function PlaySound(id: AUDIO_ID) {
    if(!sounds[id]) {
        console.error("No sound for " + id);
        throw new Error("No Sound For " + id);
    }
    sounds[id].play();
}

PreloadSound("/res/aud/newelem.mp3", "discover-new");
PreloadSound("/res/aud/newelem.mp3", "discover-old");