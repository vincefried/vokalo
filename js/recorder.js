let kick;
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

                            resolve({ audioBlob, audioUrl, play });
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
    1,0,0,0,1,0,0,0,
    1,0,0,0,1,0,0,0]

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