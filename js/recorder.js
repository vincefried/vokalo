let mainVolume = 1;
let bpm = 120;
let beats = 16;
let kick;
let kicks = [];
kicks.length = beats;
let snare;
let snares = [];
snares.length = beats;
let hat;
let hats = [];
hats.length = beats;
let pointer = 0;

const MAX_BEATS = 16;
const MIN_BEATS = 1;
const MAX_BPM = 220;
const MIN_BPM = 40;

let kickArray = [
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0];

let snareArray = [
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0];

let hatArray = [
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0];

let modal = document.getElementById('recordingModal');

let RecordingTarget = {"kick":0, "snare":1, "hat":2 };
let target = RecordingTarget.kick;

let isPlaying = false;

let context = new AudioContext();
let gainNode = context.createGain();
gainNode.connect(context.destination);
gainNode.gain.value = mainVolume;

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

window.onkeydown = function(event) {
    let key = event.keyCode ? event.keyCode : event.which;

    // If user pressed space
    if (key === 32) {
        togglePlayBeat();
    }
};

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

function init() {
    updateBPMLabel();
    updateBeatsLabel();
}

init();

async function recKick() {
    const recorder = await recordAudio();
    recorder.start();
    console.log("Started kick recording");

    setTimeout(async () => {
        kick = await recorder.stop();
        console.log("Playing kick audio");
        kick.play();
        let i;
        for (i = 0; i < kicks.length; i++)
            kicks[i] = initDrumSample(kick.audioUrl);
        }, 700);
}

async function recSnare() {
    const recorder = await recordAudio();
    recorder.start();
    console.log("Started snare recording");

    setTimeout(async () => {
        snare = await recorder.stop();
        console.log("Playing snare audio");
        snare.play();
        let i;
        for (i = 0; i < snares.length; i++)
            snares[i] = initDrumSample(snare.audioUrl)
    }, 700);
}

async function recHat() {
    const recorder = await recordAudio();
    recorder.start();
    console.log("Started hat recording");

    setTimeout(async () => {
        hat = await recorder.stop();
        console.log("Playing hat audio");
        hat.play();
        let i;
        for (i = 0; i < hats.length; i++)
            hats[i] = initDrumSample(hat.audioUrl)
    }, 700);
}

function mainVolumeChanged(value) {
    mainVolume = value / 100;
    gainNode.gain.value = mainVolume;
    $("#main-volume-label").text(value + "%");
}

function updateBeatsLabel() {
    $("#beats-label").text(beats + " Beats");
}

function increaseBeats() {
    if (beats >= MAX_BEATS) { return; }

    beats++;
    updateBeatsLabel();
}

function decreaseBeats() {
    if (beats <= MIN_BEATS) { return; }

    beats--;
    updateBeatsLabel();
}

function updateBPMLabel() {
    $("#bpm-label").text(bpm + " BPM");
}

function increaseBPM() {
    if (bpm >= MAX_BPM) { return; }

    bpm++;
    updateBPMLabel();
}

function decreaseBPM() {
    if (bpm <= MIN_BPM) { return; }

    bpm--;
    updateBPMLabel();
}

function openRecordingModal(target) {
    this.target = target;

    modal.style.display = "block";
    setupRecordingContainer();
}

function closeRecordingModal() {
    modal.style.display = "none";
}

function getIntervalLength() {
    return (60 * 1000) / bpm / 4; // (60 seconds * 1000 milliseconds) / bpm / (beats / 4 tacts)
}

function togglePlayBeat() {
    context.resume().then(() => {
        console.log('Playback resumed successfully');
    });

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
        }, getIntervalLength());
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
            $(element).addClass("play-indicator-active-toggled");
        else
            $(element).removeClass("play-indicator-active-toggled")
    });

    if(kickArray[pointer]) {
        console.log("Kick");
        kicks[pointer].play();
    }

    if(snareArray[pointer]) {
        console.log("Snare");
        snares[pointer].play();
    }

    if(hatArray[pointer]) {
        console.log("Hat");
        hats[pointer].play();
    }

    if(pointer < (beats - 1))
        pointer++;
    else
        pointer = 0;
}

$(".drum-cell").each((index, element) => $(element).click(event => {
    if ($(event.target).parents('#kick').length === 1) {
        kickArray[index % kickArray.length] ^= 1
    } else if ($(event.target).parents('#snare').length === 1) {
        snareArray[index % snareArray.length] ^= 1
    } else if ($(event.target).parents('#hat').length === 1) {
        hatArray[index % hatArray.length] ^= 1
    }

    if (event.target.className === "drum-cell"
        || event.target.className === "drum-cell-active-toggled") {
        $(event.target).toggleClass("drum-cell drum-cell-active-toggled");
        $(event.target).children("div").toggleClass("drum-cell-dot drum-cell-dot-active-toggled");
    } else if (event.target.className === "drum-cell-dot"
                || event.target.className === "drum-cell-dot-active-toggled") {
        $(event.target).parent("div").toggleClass("drum-cell drum-cell-active-toggled");
        $(event.target).toggleClass("drum-cell-dot drum-cell-dot-active-toggled");
    }
}));

function initDrumSample(url) {
    let sound = new Audio(url);
    let soundNode = context.createMediaElementSource(sound);
    soundNode.connect(gainNode);
    return sound
}

function setupRecordingContainer() {
    $(".modal-bottom-button-container").addClass("hide")
        .removeClass("show");
    $(".spinner-container").removeClass("spinner-container-play-toggled")
        .removeClass("spinner-container-record-toggled")
        .append("<div class=\"row h-100 align-items-center\">\n" +
            "<div class=\"col-md-12 nopadding\">\n" +
            "<h2 class=\"spinner-container-text\">REC</h2>\n" +
            "</div>\n" +
            "</div>")
        .unbind()
        .click(() => {
            startRecording();
        });
}

function startRecording() {
    $(".spinner-container").addClass("spinner-container-record-toggled");
    $("#container").empty();

    let modalBar = new ProgressBar.Circle(container, {
        color: '#ff273c',
        // This has to be the same size as the maximum width to
        // prevent clipping
        strokeWidth: 10,
        trailWidth: 0,
        duration: 3000,
        text: {
            autoStyleContainer: false
        },
        // Set default step function for all animate calls
        step: function(state, circle) {
            let value = Math.ceil(circle.value() * 3);
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
    setTimeout(() => {
        modalBar.destroy();
        recBar = new ProgressBar.Circle(container, {
            color: '#ff273c',
            // This has to be the same size as the maximum width to
            // prevent clipping
            strokeWidth: 10,
            trailWidth: 0,
            duration: 700,
            text: {
                autoStyleContainer: false
            },
            from: { color: '#ff273c', width: 3 },
            to: { color: '#ff273c', width: 2 },
            // Set default step function for all animate calls
            step: function(state, circle) {
                circle.setText("");
            }
        });
        recBar.text.style.fontFamily = 'Nunito Sans, sans-serif';
        recBar.text.style.fontWeight = '900';
        recBar.text.style.fontSize = '25px';
        recBar.set(0.0);
        recBar.animate(1.0);  // Number from 0.0 to 1.0
        switch (this.target) {
            case RecordingTarget.kick:
                recKick();
                break;
            case RecordingTarget.snare:
                recSnare();
                break;
            case RecordingTarget.hat:
                recHat();
                break;
            default:
                break;
        }

        setTimeout(() => {
            setupPlayContainer();
        }, 700)
    }, 3000)

}

function setupPlayContainer() {
    recBar.destroy();
    $(".spinner-container").removeClass("spinner-container-record-toggled")
        .addClass("spinner-container-play-toggled")
        .unbind()
        .click(() => {
            console.log("Playing audio");
            switch (this.target) {
                case RecordingTarget.kick:
                    kick.play();
                    break;
                case RecordingTarget.snare:
                    snare.play();
                    break;
                case RecordingTarget.hat:
                    hat.play();
                    break;
                default:
                    break;
            }
        });

    $(".modal-bottom-button-container").addClass("show")
        .removeClass("hide");
}

function retryRecording() {
    setupRecordingContainer();
}

function applyRecording() {
    closeRecordingModal();
}
