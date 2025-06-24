const container = document.createElement('div');
container.classList.add('container');
document.body.appendChild(container);

const display = document.createElement('div');
display.classList.add('display');
container.appendChild(display);

const startButton = document.createElement('button');
startButton.classList.add('startButton');
startButton.textContent = 'Start';
container.appendChild(startButton);

const stopButton = document.createElement('button');
stopButton.classList.add('stopButton');
stopButton.textContent = 'Stop';
container.appendChild(stopButton);

let initialState = Date.now();
let timerStopped = true; 
