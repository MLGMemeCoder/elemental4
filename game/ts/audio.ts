import { setServers } from "dns";

type AUDIO_ID = "discover-new" | "discover-old" | "discover-nothing" | "pickup" | "drop" | "woosh";
type SOUND_PACK = "Default" | "Classic" | string;

if(!localStorage.audioprofiles) {
    localStorage.audioprofiles = JSON.stringify([]);
}

const defaultPacks = [
    {
        name: "Default",
        sounds: {
            "discover-new": "/res/aud/default/discover-new.mp3"
        }
    },
    {
        name: "Classic",
        sounds: {
            "discover-new": "/res/aud/classic/discover-new.mp3",
            "discover-old": "/res/aud/classic/discover-old.mp3",
            "discover-nothing": "/res/aud/classic/discover-nothing.mp3",
        }
    }
]

let packid: SOUND_PACK = "Default";
const sounds: { [pack: string]: { [name: string]: HTMLAudioElement } } = {};
let audioPackList: Array<{name:string,sounds:{[id:string]:string}}> = JSON.parse(localStorage.getItem("audioprofiles"));
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
    document.getElementById("sound-pack-menu-btn").innerHTML = "Sound Pack: " + id;
}

export function getAudioPackList() {
    return [
        ...audioPackList,
        ...defaultPacks,
    ];
}

export function addPack(pack: { name: string, sounds: { [id: string]: string }}) {
    audioPackList = audioPackList.filter(x => x.name !== pack.name);
    audioPackList.push(pack); 
    Object.keys(pack.sounds).forEach(id => {
        PreloadSound(pack.name, id as AUDIO_ID, pack.sounds[id]);
    });
    SetSoundPack(pack.name);
    localStorage.audioprofiles = JSON.stringify(audioPackList);
}

export function removePack(name) {
    if (packid === name) {
        SetSoundPack("Default");
    }
    audioPackList = audioPackList.filter(x => x.name !== name);
}

audioPackList.forEach(pack => {
    Object.keys(pack.sounds).forEach(id => {
        PreloadSound(pack.name, id as AUDIO_ID, pack.sounds[id]);
    });
});
defaultPacks.forEach(pack => {
    Object.keys(pack.sounds).forEach(id => {
        PreloadSound(pack.name, id as AUDIO_ID, pack.sounds[id]);
    });
});
