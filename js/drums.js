let context = new AudioContext()
let drumBuffer = null;

loadDrumSound("../Sounds/vocal_sample.wav");

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
    });

let kickArray = [
    1,0,0,0,0,0,1,0,
    1,0,0,0,0,1,0,0]

let snareArray = [
    0,0,0,0,1,0,0,0,
    0,1,0,0,1,0,0,0]

let hatArray = [
    1,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1]

let clapArray = [
    1,1,0,1,1,0,1,1,
    0,1,1,0,1,1,1,1]

let pointer = 0

let sounds = [
    initDrum("kick.wav"),
    initDrum("sound2.wav"),
    initDrum("sound3.wav"),
    initDrum("sound4.wav")
]

function startDrumLoop() {
    setInterval(function(){
        playDrumBeat()
    }, 150);
}

function fuckupmyclap() {
    clapArray = [
        1,1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,1]
}

function playDrumBeat() {

   if(kickArray[pointer])
       async () => sounds[0].play()

    if(snareArray[pointer])
        async () => sounds[1].play()
        //console.log("Snare!");*/

    if(clapArray[pointer])
        async () => sounds[2].play()

    if(hatArray[pointer])
        async () => sounds[3].play()


    if(pointer < 15)
        pointer++
    else
        pointer = 0
}

function initDrum(sound) {
    var context = new AudioContext();
    var sound = new Audio("../Sounds/"+sound);
    var soundNode = context.createMediaElementSource(sound);
    var gainNode = context.createGain();
    gainNode.gain.value = 0.8;
    soundNode.connect(gainNode);
    gainNode.connect(context.destination);
    return sound
}

function playDrum(number) {

}

function loadDrumSound(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // Decode asynchronously
    request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
            drumBuffer = buffer;
        });
    }
    request.onloadend = function () {
        console.log("Sound loaded!")
    }
    request.send();
}

function playSoundBuffer(buffer, detune) {
    let source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    //source.playbackRate.value = speed;
    source.detune.value = detune;
    //source.playbackRate.value = 1 / speed;
    source.connect(context.destination);
    source.loop = true;
    source.start(0);
    console.log("started");
    return source;
}

let test1, test2, test3, test4;

document.addEventListener('keypress', (event) => {
    const keyName = event.key;
    switch(keyName) {
        case "1":
            if(!test1)
                test1 = playSoundBuffer(drumBuffer, -1200);
            break;
        case "2":
            if(!test2)
                test2 = playSoundBuffer(drumBuffer, -800);
            break;
        case "3":
            if(!test3)
                test3 = playSoundBuffer(drumBuffer, -500);
            break;
        case "4":
            if(!test4)
                test4 = playSoundBuffer(drumBuffer, 700);
            break;
    }
    //alert('keydown event\n\n' + 'key: ' + keyName);
});

document.addEventListener('keyup', (event) => {
    const keyName = event.key;
    switch(keyName) {
        case "1":
            if(test1) {
                test1.stop(0);
                test1 = null;
            }
            break;
        case "2":
            if(test2) {
                test2.stop(0);
                test2 = null;
            }
            break;
        case "3":
            if(test3) {
                test3.stop(0);
                test3 = null;
            }
            break;
        case "4":
            if(test4) {
                test4.stop(0);
                test4 = null;
            }
            break;
    }
});

