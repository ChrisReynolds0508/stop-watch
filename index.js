const container = document.createElement('div');
container.classList.add('container');
document.body.appendChild(container);

const display = document.createElement('div');
display.classList.add('display');
display.innerHTML = `
  <div class="flip" id="hours"></div>
  <div class="sep">:</div>
  <div class="flip" id="minutes"></div>
  <div class="sep">:</div>
  <div class="flip" id="seconds"></div>
  <div class="sep">:</div>
  <div class="flip" id="centis"></div>
`;
container.appendChild(display);

function buildCard(el) {
  el.innerHTML = `
    <div class="upper">00</div>
    <div class="lower">00</div>
  `;
}

// Immediately build cards once DOM elements exist
['hours', 'minutes', 'seconds', 'centis'].forEach(id => {
  const el = document.getElementById(id);
  buildCard(el);
});

const centis = document.getElementById('centis');
centis.querySelector('.upper').textContent = '000';
centis.querySelector('.lower').textContent = '000';

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
container.appendChild(resetButton);

const lapButton = document.createElement('button');
lapButton.classList.add('lapButton');
lapButton.textContent = 'Lap';
lapButton.disabled = true;
container.appendChild(lapButton);
               
const lapList = document.createElement('ul');
lapList.id = 'lapList';
lapList.style.listStyleType = 'none';
lapList.style.paddingLeft = '0';
container.appendChild(lapList);

let startTime;
let interval; 
let totalElapsed = 0;
let timerStarted  = false; 
let laps = [];

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

const renderLaps = () => {
    const ul = document.getElementById('lapList');
    ul.innerHTML = '';

    laps.forEach((ms, i) =>{
        const li = document.createElement('li');
        li.textContent = `Lap ${i + 1}: ${formatTime(ms)}`;
        ul.appendChild(li);
    })
    
}

function flipTo(cardEl, newValue) {
  const currentVal = cardEl.querySelector('.upper').textContent;
  if (currentVal === newValue) return;          // no change → no animation

  const upper = cardEl.querySelector('.upper');
  const lower = cardEl.querySelector('.lower');

  // Create temp clones for animation
  const upperClone = upper.cloneNode(true);
  const lowerClone = lower.cloneNode(true);

  upperClone.textContent = currentVal;
  lowerClone.textContent = newValue;

  upperClone.classList.add('flip-out');
  lowerClone.classList.add('flip-in');

  // Insert clones
  cardEl.appendChild(upperClone);
  cardEl.appendChild(lowerClone);

  // Clean up after animation ends
  upperClone.addEventListener('animationend', () => {
    upper.textContent = newValue;
    upperClone.remove();
  });
  lowerClone.addEventListener('animationend', () => {
    lower.textContent = newValue;
    lowerClone.remove();
  });
}



const start = () => {
   startButton.addEventListener('click', () => {
    if(!timerStarted){
        timerStarted = true;
        display.classList.remove('paused', 'reset');
display.classList.add('running');

        lapButton.disabled = false;
        startTime = Date.now();

        interval = setInterval(() => {
            const currentElapsed = Date.now() - startTime;
            const totalTime = totalElapsed + currentElapsed;
            const h  = String(Math.floor(totalTime / 3600000)).padStart(2, '0');
const m  = String(Math.floor((totalTime % 3600000) / 60000)).padStart(2, '0');
const s  = String(Math.floor((totalTime % 60000) / 1000)).padStart(2, '0');
const ms = String(Math.floor(totalTime % 1000)).padStart(3, '0'); // ← full milliseconds
 

flipTo(document.getElementById('hours'),   h);
flipTo(document.getElementById('minutes'), m);
flipTo(document.getElementById('seconds'), s);
flipTo(document.getElementById('centis'),  ms);

        }, 10)
    }    
   })
}

stopButton.addEventListener('click', () => {
    if(timerStarted){
    clearInterval(interval);
    timerStarted = false;
    display.classList.remove('running');
display.classList.add('paused');

    lapButton.disabled = true;
    totalElapsed += Date.now() - startTime;
    }
}) 

resetButton.addEventListener('click', () => {
    clearInterval(interval);
    timerStarted = false;
    display.classList.remove('running', 'paused');
display.classList.add('reset');

    lapButton.disabled = true;
     totalElapsed = 0;
   ['hours','minutes','seconds','centis'].forEach(id => {
  const card = document.getElementById(id);
  card.querySelector('.upper').textContent = '00';
  card.querySelector('.lower').textContent = '00';
  const centis = document.getElementById('centis');
centis.querySelector('.upper').textContent = '000';
centis.querySelector('.lower').textContent = '000';
});


    laps = [];
    renderLaps();    // empties the visible list

});

lapButton.addEventListener('click', () => {
        const lapTime = (Date.now() - startTime) + totalElapsed;
        laps.push(lapTime) 
        renderLaps(); 
        })

        document.addEventListener('keydown', (event) => {
            const key = event.key.toLowerCase();

            if(key === ' '){
                event.preventDefault();
                if(!timerStarted){
                    startButton.click();
                }else{
                    stopButton.click();
                }
            }
            if(key === 'r'){
                resetButton.click();
            }
            if(key === 'l' && timerStarted){
                lapButton.click();

            }
        })

start();

