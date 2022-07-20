let isReady = false;

//Keys you press
const KEYS = [
    "a", "z", "e", "r", "t", "y", "u",
    "q", "s", "d", "f", "g", "h", "j",
    "w", "x", "c", "v", "b", "n", ",", "?"
]

//Notes corresponding to the keys you press
const NOTES = [
    "C5", "D5", "E5", "F5", "G5", "A5", "B5",
    "C4", "D4", "E4", "F4", "G4", "A4", "B4",
    "C3", "D3", "E3", "F3", "G3", "A3", "B3", "B3"
]

//Colors or the circles
const COLORS = [
    "red" , "pink", "orange", "yellow", "green", "blue", "purple"
]

/*
Method:
args : DOM element
return : Object carrying the absolute positions of a DOM element
*/
const getOffset = (el) => {
    const rect = el.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();
    return {
        left: rect.left - bodyRect.left,
        top: rect.top - bodyRect.top
    };
  }

  /*
  Method:
  args: Key as formatted in KEYS
  return : None
  def : Animates when the user presses a key or clicks a circle
  */
const anim = (key) => {
    let element = document.getElementById(NOTES[KEYS.indexOf(key)]);
    const echo = document.createElement('div');
    echo.classList.add("echo");
    if(KEYS.indexOf(key) == 21) echo.classList.add("border-purple");
    else echo.classList.add("border-"+COLORS[KEYS.indexOf(key) % 7]);
    const pos = getOffset(element);
    echo.style.top = pos.top+"px";
    echo.style.left = pos.left+"px";
    app.appendChild(echo);
    element.style.width = "10vh";
    element.style.height = "10vh";
    element.style.transform = "scale(90%)";
    setTimeout(() => {
        element.style.transform = "";
    }, 120)
    setTimeout(() => {
        echo.remove();
    }, 2000);
}

/*
Method:
args: None
return : None
def : Plays the into song
*/
const loadingSong = () => {
    const songNotes = [C3, E3, G3, C4, E4, G4, C5];
    let index = 0;
    const loop = setInterval(() => {
        songNotes[index].click();
        index++;
    },200);
    setTimeout(() => {clearInterval(loop)},1450);
}

/*Delay*/
Tone.context.lookAhead = 0;

// Reverb module
const reverb = new Tone.Reverb(5).toDestination();

//Sampling the Harp samples, turning down the volume and connecting the reverb to the output
const sampler = new Tone.Sampler({
    urls: {
        A2: "A2.wav",
        A4: "A4.wav",
        A6: "A6.wav",
        B1: "B1.wav",
        B3: "B3.wav",
        B5: "B5.wav",
        B6: "B6.wav",
        C3: "C3.wav",
        C5: "C5.wav",
        D2: "D2.wav",
        D4: "D4.wav",
        D6: "D6.wav",
        D7: "D7.wav",
        E1: "E1.wav",
        E3: "E3.wav",
        E5: "E5.wav",
        F2: "F2.wav",
        F4: "F4.wav",
        F6: "F6.wav",
        F7: "F7.wav",
        G1: "G1.wav",
        G3: "G3.wav",
        G5: "G5.wav",
    },
    release: 1,
    baseUrl: "samples/harp/",
    volume: -15,
}).toDestination().connect(reverb);

/*Loading the page*/
const nowLoading = Tone.now()
const loading = document.getElementById("loading-box");
const loadingTitle = document.getElementById("loading-title");
loadingTitle.classList.add("loading-title-blink");
setTimeout(() => {
    isReady = true;
    loading.style.opacity = 0;
    loadingTitle.classList.remove("loading-title-blink");
    loadingSong();
    setTimeout(() => {
        loading.remove();
    }, 1000);
}, 3000);

//Event listening to keypressing
document.body.addEventListener("keydown", e => {
    if(!isReady) return;
    if(e.repeat) return;
    if(!"azertyuqsdfghjwxcvbn,?".includes(e.key.toLowerCase())) return; 
    sampler.triggerAttackRelease(NOTES[KEYS.indexOf(e.key.toLowerCase())], "8n");
    anim(e.key.toLowerCase());
});

//Event listening to clicks
document.querySelectorAll(".note").forEach(el => {
    el.addEventListener("click", (e) => {
        if(!isReady) return;
        sampler.triggerAttackRelease(el.dataset.note, "8n");
        anim(KEYS[NOTES.indexOf(el.dataset.note)]);
    });
});