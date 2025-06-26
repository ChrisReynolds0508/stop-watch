const container = document.createElement('div');
container.classList.add('container');
document.body.appendChild(container);

const display = document.createElement('div');
display.classList.add('display');
display.textContent = 'Time: 00:00:00:000';
container.appendChild(display);

const startButton = document.createElement('button');
startButton.classList.add('startButton');
startButton.textContent = 'Start';
container.appendChild(startButton);

const stopButton = document.createElement('button');
stopButton.classList.add('stopButton');
stopButton.textContent = 'Stop';
container.appendChild(stopButton);

const resetButton = document.createElement('button');
resetButton.textContent = 'Reset';
resetButton.classList.add('resetButton');
container.appendChild(resetButton)

let startTime;
let interval; 
let totalElapsed = 0;
let timerStarted  = false; 

const formatTime = (ms) => {
    const hours = Math.floor(ms/3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor(ms % 1000);

    return (
        String(hours).padStart(2,'0') + ':' +
        String(minutes).padStart(2,'0') + ':' +
        String(seconds).padStart(2,'0') + ':' +
        String(milliseconds).padStart(3,'0')
    );
}

const start = () => {
   startButton.addEventListener('click', () => {
    if(!timerStarted){
        timerStarted = true;
        startTime = Date.now();

        interval = setInterval(() => {
            const currentElapsed = Date.now() - startTime;
            const totalTime = totalElapsed + currentElapsed;
            display.textContent = `Time: ${formatTime(totalTime)}`
        }, 10)
    }
    
   })
}


stopButton.addEventListener('click', () => {
    if(timerStarted){
    clearInterval(interval);
    timerStarted = false;
    totalElapsed += Date.now() - startTime;
    }
}) 

resetButton.addEventListener('click', () => {
    clearInterval(interval);
    timerStarted = false;
     totalElapsed = 0;
    display.textContent = 'Time: 00:00:00:000'
});
start();

