// Initializing an AudioContext to access Web Audio API methods
const audioContext = new AudioContext();
const songElement = document.querySelector('#watermelonman');
const audioSource = audioContext.createMediaElementSource(songElement);

// plug audio element into the AudionContext and connect output to speakers
audioSource.connect(audioContext.destination);

const playButtonNodeList = document.querySelectorAll("#playbutton");

//look to add functionlity for  multiple tracks/play buttons, checking if button id === audio id (add playbutton class in HTML)
playButtonNodeList.forEach((playButton) => {
    playButton.addEventListener('click', () => {
        if (!songElement.paused) {
            songElement.pause();
        } else if (songElement.paused) {
            songElement.play(); 
        }
        startAudioContext();
    });    
});
// AudioContext loads as suspended due to autoplzay restrictions
const startAudioContext = () => {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
        songElement.play();
    }
};

// create analyser and print data onto the page
// use analyser data to create canvas visualization
const analyser = audioContext.createAnalyser();
audioSource.connect(analyser);

analyser.fftSize = 512;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const canvas = document.querySelector('#frequency-canvas');
const body = document.querySelector('body');
const canvasContext = canvas.getContext('2d');

const draw = () => {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    canvasContext.fillStyle = 'rgb(54, 94, 70)';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / (bufferLength / 4))
    let xAxis = 0;

    for (i = 0; i < bufferLength; i++) {
        const barHeight = Math.pow(dataArray[i], 1.05);

        canvasContext.fillStyle = 'rgb(' + (barHeight / 1.2) + ',250 , 200)';
        canvasContext.fillRect(xAxis, canvas.height-barHeight, barWidth, barHeight);

        xAxis += barWidth + 1;
    }
};
draw();
