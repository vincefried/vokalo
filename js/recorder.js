let kick;
let kicks = [];
kicks.length = 16;
let snare;
let snares = [];
snares.length = 16;
let hat;
let hats = [];
hats.length = 16;
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
    console.log("Started kick recording")

    setTimeout(async () => {
        kick = await recorder.stop();
        console.log("Playing kick audio")
        kick.play();
        let i;
        for (i = 0; i < kicks.length; i++)
            kicks[i] = new Audio(kick.audioUrl)
        }, 700);
}

async function recSnare() {
    const recorder = await recordAudio();
    recorder.start();
    console.log("Started snare recording")

    setTimeout(async () => {
        snare = await recorder.stop();
        console.log("Playing snare audio")
        snare.play();
        let i;
        for (i = 0; i < snares.length; i++)
            snares[i] = new Audio(snare.audioUrl)
    }, 700);
}

async function recHat() {
    const recorder = await recordAudio();
    recorder.start();
    console.log("Started hat recording")

    setTimeout(async () => {
        hat = await recorder.stop();
        console.log("Playing hat audio")
        hat.play();
        let i;
        for (i = 0; i < hats.length; i++)
            hats[i] = new Audio(hat.audioUrl)
    }, 700);
}

async function playAudio() {
    kick.play();
    snare.play();
    hat.play();
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
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0]

let hatArray = [
    0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0]

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

let RecordingTarget = {"kick":0, "snare":1, "hat":2 };
let target = RecordingTarget.kick;

function openRecordingModal(target) {
    this.target = target;

    modal.style.display = "block";
    setupRecordingContainer();
}

function closeRecordingModal() {
    modal.style.display = "none";
}

var isPlaying = false;

function togglePlayBeat() {
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
        }, 150);
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

window.onkeydown = function(event) {
    let key = event.keyCode ? event.keyCode : event.which;

    // If user pressed space
    if (key === 32) {
        togglePlayBeat();
    }
}

// Events
$(".drum-cell").each((index, element) => $(element).click(event => {
    if (event.target.className === "drum-cell") {
        if ($(event.target).parents('#kick').length === 1) {
            kickArray[index % kickArray.length] ^= 1
        } else if ($(event.target).parents('#snare').length === 1) {
            snareArray[index % snareArray.length] ^= 1
        } else if ($(event.target).parents('#hat').length === 1) {
            hatArray[index % hatArray.length] ^= 1
        }
    }
    
    if (event.target.className === "drum-cell"
        || event.target.className === "drum-cell-active-toggled") {
        $(event.target).toggleClass("drum-cell drum-cell-active-toggled");
    }
    $(event.target).children("div").toggleClass("drum-cell-dot drum-cell-dot-active-toggled")
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
        .click(event => {
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
        .click(event => {
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
