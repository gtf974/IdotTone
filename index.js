let isReady = false;
let recorded = "";
let recordNotes = [];
let recordTime = [];
let isRecording = false;
let isPlaying = false;
let isFirstLoad = true;
let now = null;
let currentKeyboardLayout = "azerty";

//Keys you press
const AZERTYKEYS = [
    "a", "z", "e", "r", "t", "y", "u",
    "q", "s", "d", "f", "g", "h", "j",
    "w", "x", "c", "v", "b", "n", ",", "?"
]

const QWERTYKEYS = [
    "q", "w", "e", "r", "t", "y", "u",
    "a", "s", "d", "f", "g", "h", "j",
    "z", "x", "c", "v", "b", "n", "m"
]

const QWERTZKEYS = [
    "q", "w", "e", "r", "t", "y", "u",
    "a", "s", "d", "f", "g", "h", "j",
    "z", "x", "c", "v", "b", "n", "m"
]

//Azerty layout by default
let KEYS = [
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

//Test if it's an integer
const isInteger = (value) => {
    return /^\d+$/.test(value);
  }

/*
Method:
args : None
return : None
*/
let getUrlParams = () => {
    let url = new URL(window.location.href);
    let param = url.searchParams.get("r");
    if(param) recorded = param;
};

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
const animNote = (key) => {
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

/*Delay*/
Tone.context.lookAhead = 0;

// Reverb module
// const reverb = new Tone.Reverb(10).toDestination();

const sampler = new Tone.Sampler({
    urls: {
        A3:"A4.mp3",
        A4:"A5.mp3",
        A5:"A6.mp3",
        B3:"B4.mp3",
        B4:"B5.mp3",
        B5:"B6.mp3",
        C3:"C4.mp3",
        C4:"C5.mp3",
        C5:"C6.mp3",
        D3:"D4.mp3",
        D4:"D5.mp3",
        D5:"D6.mp3",
        E3:"E4.mp3",
        E4:"E5.mp3",
        E5:"E6.mp3",
        F3:"F4.mp3",
        F4:"F5.mp3",
        F5:"F6.mp3",
        G3:"G4.mp3",
        G4:"G5.mp3",
        G5:"G6.mp3"
    },
    volume: -3,
    release: 1,
    baseUrl: "samples/lyrev2/"
}).toDestination();
//.connect(reverb);

/*
Method:
args: None
return : None
def : Plays the loading song
*/
const playRecordedSong = () => {
    if(recordNotes.length == 0) return
    const now = Date.now();
    isPlaying = true;
    for (let index = 0; index < recordNotes.length; index++) {
        setTimeout(() => {
            document.getElementById(recordNotes[index]).click();
        },(now+recordTime[index]) - now);
    }
    setTimeout(() => {
        isPlaying = false;
        error.textContent = "";
    }, recordTime[recordNotes.length-1]);
}

/*
Method:
args: None
return : None
def : Plays the intro song
*/
const loadingSong = () => {
    if(recorded.length != 0){
        parseUrl();
        playRecordedSong();
        return;
    }
    const songNotes = [C3, E3, G3, C4, E4, G4, C5];
    let index = 0;
    const loop = setInterval(() => {
        songNotes[index].click();
        index++;
    },200);
    setTimeout(() => {clearInterval(loop)},1450);
}

/*
Method:
args: None
return : None
def : Parse the url
*/
const parseUrl = () => {
    if(recorded.length == 0) return;
    const split = recorded.split("@");
    recordNotes = [];
    recordTime = [];
    for (let index = 0; index < split.length; index++) {
        if(index > 0){
            if(!isInteger(split[index])){
                recordNotes.push(split[index]);
                recordTime.push(Number.parseInt(split[index-1]));
            }
        }
    }
}

/*
Method:
args: None
return : None
def : Loads everything
*/
const loadPage = () => {
    const loading = document.getElementById("loading-box");
    setTimeout(() => {
        isReady = true;
        loading.style.opacity = 0;
        setTimeout(() => {
        loading.remove();
        }, 1000);
    }, 3000);
}

/*
Method:
args: None
return : None
def : Controls the record LED blinking
*/
const animRecord = (bool) => {
    if(bool) dot.classList.add("led-blink");
    else dot.classList.remove("led-blink");
};

/*
Method:
args: index -> int
return : None
def : Change the letters according to the current keyboard layout
*/
const changeKeyboardLetters = (index) => {
    changingA.textContent = changingA.dataset.key.split("/")[index];
    changingZ.textContent = changingZ.dataset.key.split("/")[index];
    changingY.textContent = changingY.dataset.key.split("/")[index];
    changingQ.textContent = changingQ.dataset.key.split("/")[index];
    changingW.textContent = changingW.dataset.key.split("/")[index];
    changingComma.textContent = changingComma.dataset.key.split("/")[index];
}

/*
Method:
args: index -> string
return : None
def : Plays a specific note
*/
const playNote = (note) => {
    if(!isReady) return;
    sampler.triggerAttackRelease(note, 4);
    if(isRecording){
        if(recorded.length == 0) recorded +=  (Date.now() - now).toString();
        else recorded += "@" + (Date.now() - now).toString();
        recorded += "@" + note;
    }
}


//----------------------------------MAIN---------------------------------
loadPage();
getUrlParams();

//---------------------------------EVENTS--------------------------------
//Event listening to keypressing
document.body.addEventListener("keydown", e => {
    if(e.repeat) return;
    switch(currentKeyboardLayout){
        case "azerty":
            if(!"azertyuqsdfghjwxcvbn,?".includes(e.key.toLowerCase())) return;
        case "qwerty":
            if(!"azertyuqsdfghjwxcvbnm".includes(e.key.toLowerCase())) return;
        case "qwertz":
            if(!"azertyuqsdfghjwxcvbnm".includes(e.key.toLowerCase())) return;
    }
    playNote(NOTES[KEYS.indexOf(e.key.toLowerCase())]);
    animNote(e.key.toLowerCase());
});

//Event listening to clicks
document.querySelectorAll(".note").forEach(el => {
    el.addEventListener("click", (e) => {
        playNote(el.dataset.note);
        animNote(KEYS[NOTES.indexOf(el.dataset.note)]);
    });
});

//Event listening to Play click
play.addEventListener("click", () => {
    if(isRecording){
        error.textContent = "It's recording...";
        setTimeout(() => {
            if(error.textContent == "It's recording...") error.textContent = "";
        }, 2000)
        return;
    }
    if(recorded == ""){
        error.textContent = "Nothing to play...";
        setTimeout(() => {
            if(error.textContent == "Nothing to play...") error.textContent = "";
        }, 2000)
        return;
    }
    if(isPlaying){
        error.textContent = "It's currently playing...";
        setTimeout(() => {
            if(error.textContent == "It's currently playing...") error.textContent = "";
        }, 2000)
        return;
    }
    parseUrl();
    playRecordedSong();
})

//Event listening to Record click
record.addEventListener("click", () => {
    if(isRecording){
        isRecording = false;
        recordText.textContent = "Record"
        animRecord(false);
        return;
    }
    if(isPlaying){
        error.textContent = "Wait for the music to end before recording..";
        return;
    }
    recorded = "";
    now = Date.now();
    recordText.textContent = "Stop"
    isRecording = true;
    animRecord(true);
    setTimeout(() => {
        if(isRecording){
            isRecording = false;
            recordText.textContent = "Record";
            animRecord(false);
        }
    }, 10000);
    
});

//Event listening to Copy click
copy.addEventListener("click", () => {
    if(isRecording) {
        isRecording = false;
        recordText.textContent = "Record";
        animRecord(false);
   }
    navigator.clipboard.writeText("https://idottone.netlify.app/?r="+recorded);
    error.textContent = "Copied!";
    setTimeout(() => {
        if(error.textContent == "Copied!") error.textContent = "";
    }, 2000)
});

//Event listening to Azerty click
azerty.addEventListener("click", () => {
    if(currentKeyboardLayout != "azerty"){
        currentKeyboardLayout = "azerty";
        KEYS = AZERTYKEYS;
        changeKeyboardLetters(0);
        azerty.classList.add("selected");
        qwerty.classList.remove("selected");
        qwertz.classList.remove("selected");
    }
});

//Event listening to Qwerty click
qwerty.addEventListener("click", () => {
    if(currentKeyboardLayout != "qwerty"){
        currentKeyboardLayout = "qwerty";
        KEYS = QWERTYKEYS;
        changeKeyboardLetters(1);
        qwerty.classList.add("selected");
        azerty.classList.remove("selected");
        qwertz.classList.remove("selected");
    }
});

//Event listening to Qwertz click
qwertz.addEventListener("click", () => {
    if(currentKeyboardLayout != "qwertz"){
        currentKeyboardLayout = "qwertz";
        KEYS = QWERTZKEYS;
        changeKeyboardLetters(2);
        qwertz.classList.add("selected");
        azerty.classList.remove("selected");
        qwerty.classList.remove("selected");
    }
});

//Event listening to Help click
helpButton.addEventListener("click", () => {
    if(help.style.opacity == 0){
        help.style.display = "block";
        setTimeout(() => {
            help.style.opacity = 1;
        }, 20);
    }
});

//Event listening to background help click click
back.addEventListener("click", () => {
        help.style.opacity = 0;
        setTimeout(() => {
            help.style.display = "none";
        }, 500);
        if(isFirstLoad){
            isFirstLoad = false;
            loadingSong();
        }
});