"use strict";

const CARROT_SIZE = 80;
const CARROT_COUNT = 10;
const BUG_COUNT = 10;
const GAME_TIME_DURATION = 10;

const field = document.querySelector(".game_field");
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector(".game_play");
const gameTimer = document.querySelector(".display_timer");
const gameCount = document.querySelector(".game_count");
const fieldPopup = document.querySelector(".popup-field");
const replyBtn = document.querySelector(".reply");

const carrotSound = new Audio("./sound/carrot_pull.mp3");
const bugSound = new Audio("./sound/bug_pull.mp3");
const bgSound = new Audio("./sound/bg.mp3");
const alertSound = new Audio("./sound/alert.wav");
const winSound = new Audio("./sound/game_win.mp3");

var timerId = null;
let started = false;
let score = 0;
let timer = undefined;
let time = 0;

//////////////////   Event List /////////////////////////////
field.addEventListener("click", onClickField);
gameBtn.addEventListener("click", (event) => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }

  //started = !started;
});

replyBtn.addEventListener("click", () => {
  startGame();
});

//////////////////   Start / Stop Mode /////////////////////////////
function startGame() {
  started = true;
  score = 0;
  showStopBtn();
  displayTimerandScore("visible");
  gameCount.innerHTML = CARROT_COUNT;
  displayPopupField(false);
  startGameTimer();
  initGame();
  playSound(bgSound);
}

function stopGame() {
  started = false;
  showPlayBtn();
  // displayTimerandScore("hidden");
  // field.innerHTML = ``;
  stopGameTimer();
  displayPopupField(true);
  stopSound(bgSound);
}

function showStopBtn() {
  const icon = document.querySelector(".fas");

  icon.classList.add("fa-stop");
  icon.classList.remove("fa-play");
}

function showPlayBtn() {
  const icon = document.querySelector(".fas");

  icon.classList.add("fa-play");
  icon.classList.remove("fa-stop");
}

function displayTimerandScore(displayMode) {
  gameTimer.style.visibility = displayMode;
  gameCount.style.visibility = displayMode;
}

function displayPopupField(displayMode) {
  console.log(`display mode = ${displayMode}`);

  if (displayMode) {
    console.log("true");
    fieldPopup.classList.remove("popup-field-hide");
  } else {
    console.log("false");
    fieldPopup.classList.add("popup-field-hide");
  }
}
//////////////////   Game Working  /////////////////////////////
function startGameTimer() {
  let remainTimsec = GAME_TIME_DURATION;

  updateTime(remainTimsec);
  stopGameTimer();

  timerId = setInterval(() => {
    if (remainTimsec <= 0) {
      stopGameTimer();
      stopGame();
      return;
    }
    updateTime(--remainTimsec);
  }, 1000);
}

function stopGameTimer() {
  if (timerId) {
    clearTimeout(timerId);
  }
}
//////////////////   Score update  /////////////////////////////
function updateScore() {
  gameCount.innerHTML = CARROT_COUNT - score;
}

function updateTime(time) {
  // update :: Timer
  const minute = Math.floor(time / 60);
  const second = time % 60;

  // console.log(`update timer = ${time}`);
  gameTimer.innerHTML = `${minute}:${second}`;
}

function onClickField(event) {
  if (!started) {
    return;
  }
  const target = event.target;

  if (target.matches(".carrot")) {
    score++;
    playSound(carrotSound);
    target.remove();
    updateScore();
    if (score >= CARROT_COUNT) {
      stopGame();
      return;
    }
  } else if (target.matches(".bug")) {
    playSound(bugSound);
    stopGame();
    return;
  }
}

function playSound(sound) {
  sound.currendTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}

//////////////////   Init Game  /////////////////////////////
function initGame() {
  console.log(fieldRect);
  field.innerHTML = ``;

  addItem("carrot", CARROT_COUNT, "img/carrot.png");
  addItem("bug", CARROT_COUNT, "img/bug.png");
}

function addItem(className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - CARROT_SIZE;
  const y2 = fieldRect.height - CARROT_SIZE;

  for (let i = 0; i < count; i++) {
    const item = document.createElement("img");
    item.setAttribute("class", className);
    item.setAttribute("src", imgPath);
    item.style.position = "absolute";

    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);

    console.log(`x = ${x}, y=${y}`);

    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    field.appendChild(item);
  }
}

function randomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

initGame();
