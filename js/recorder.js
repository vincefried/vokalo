let kick;
let kicks = [];
kicks.length = 16;
let snare;
let hat;
let pointer = 0;

const recordAudio = () => {
    return new Promise(resolve => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream);
                const audioChunks = [];

                mediaRecorder.addEventListener("dataavailable", event => {
                    audioChunks.push(event.data);
                });

                const start = () => {
                    mediaRecorder.start();
                };

                const stop = () => {
                    return new Promise(resolve => {
                        mediaRecorder.addEventListener("stop", () => {
                            const audioBlob = new Blob(audioChunks);
                            const audioUrl = URL.createObjectURL(audioBlob);
                            const audio = new Audio(audioUrl);
                            const play = () => {
                                audio.play();
                            };

                            resolve({ audioBlob, audioUrl, play, audio });
                        });

                        mediaRecorder.stop();
                    });
                };

                resolve({ start, stop });
            });
    });
};

async function recKick() {
    const recorder = await recordAudio();
    recorder.start();
    console.log("Started recording")

    setTimeout(async () => {
        kick = await recorder.stop();
        console.log("Playing audio")
        kick.play();
        let i;
        for (i = 0; i < kicks.length; i++)
            kicks[i] = new Audio(kick.audioUrl)
        }, 700);
}

async function recSnare() {
    const recorder = await recordAudio();
    recorder.start();
    console.log("Started recording")

    setTimeout(async () => {
        snare = await recorder.stop();
        console.log("Playing audio")
        snare.play();
    }, 700);
}

async function recHat() {
    const recorder = await recordAudio();
    recorder.start();
    console.log("Started recording")

    setTimeout(async () => {
        hat = await recorder.stop();
        console.log("Playing audio")
        hat.play();
    }, 700);
}

async function playAudio() {
    kick.play();
    snare.play();
}

function startDrumLoop() {
    setInterval(function(){
        playDrumBeat()
    }, 150);
}

let kickArray = [
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0]

let snareArray = [
    0,0,1,0,0,0,1,0,
    0,0,1,0,0,0,1,0]

let hatArray = [
    1,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1]

function playDrumBeat() {

    if(kickArray[pointer])
        async () => kick.play()

    if(snareArray[pointer])
        async () => snare.play()

    if(hatArray[pointer])
        async () => hat.play()

    if(pointer < 15)
        pointer++
    else
        pointer = 0
}

let modal = document.getElementById('recordingModal');

function openRecordingModal() {
    modal.style.display = "block";
    startRecording();
}

function closeRecordingModal() {
    modal.style.display = "none";
}

var isPlaying = false;

function playBeat() {
    if (isPlaying) {
        isPlaying = false;
        $(".play-button").removeClass("play-button-active-toggled");
        clearInterval(playInterval);
        resetBeat();
    } else {
        isPlaying = true;
        $(".play-button").addClass("play-button-active-toggled");
        playInterval = setInterval(function(){
            playOneBeat()
        }, 300);
    }
}

function resetBeat() {
    pointer = 0;

    $(".play-indicator").each((index, element) => {
        $(element).removeClass("play-indicator-active-toggled")
    });
}

function playOneBeat() {
    $(".play-indicator").each((index, element) => {
        if(index === pointer)
            $(element).addClass("play-indicator-active-toggled")
        else
            $(element).removeClass("play-indicator-active-toggled")
    });

    if(kickArray[pointer])
        kicks[pointer].play();

    if(pointer < 15)
        pointer++;
    else
        pointer = 0;
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Events
$(".drum-cell").each((index, element) => $(element).click(event => {
    if (event.target.className === "drum-cell"
        || event.target.className === "drum-cell-active-toggled") {
        $(event.target).toggleClass("drum-cell drum-cell-active-toggled");
    }
    $(event.target).children("div").toggleClass("drum-cell-dot drum-cell-dot-active-toggled")
    kickArray[index] ^= 1
}));

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


function startRecording() {
    $("#container").empty();
    let modalBar = new ProgressBar.Circle(container, {
        color: '#ff273c',
        // This has to be the same size as the maximum width to
        // prevent clipping
        strokeWidth: 4,
        trailWidth: 1,
        duration: 3000,
        text: {
            autoStyleContainer: false
        },
        // Set default step function for all animate calls
        step: function(state, circle) {

            var value = Math.round(circle.value() * 3);
            if (value === 0) {
                circle.setText('');
            } else {
                circle.setText(value);
            }

        }
    });
    modalBar.text.style.fontFamily = 'Nunito Sans, sans-serif';
    modalBar.text.style.fontWeight = '900';
    modalBar.text.style.fontSize = '25px';
    modalBar.set(1.0);
    modalBar.animate(0.0);  // Number from 0.0 to 1.0
    setInterval(() => {
        modalBar.destroy();
        let recBar = new ProgressBar.Circle(container, {
            color: '#ff273c',
            // This has to be the same size as the maximum width to
            // prevent clipping
            strokeWidth: 4,
            trailWidth: 1,
            duration: 700,
            text: {
                autoStyleContainer: false
            },
            from: { color: '#ff273c', width: 3 },
            to: { color: '#ff273c', width: 2 },
            // Set default step function for all animate calls
            step: function(state, circle) {
                circle.setText("REC");
            }
        });
        recBar.text.style.fontFamily = 'Nunito Sans, sans-serif';
        recBar.text.style.fontWeight = '900';
        recBar.text.style.fontSize = '25px';
        recBar.set(0.0);
        recBar.animate(1.0);  // Number from 0.0 to 1.0
        recKick();
    }, 3000)
}
