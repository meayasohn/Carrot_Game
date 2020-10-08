'use strict'

import { GameField, ItemType } from './view.js';
import * as sound from './sound.js';

export class GameBuilder {
    gameDuration(duration) {
      this.gameDuration = duration;
      return this;
    }
  
    carrotCount(num) {
      this.carrotCount = num;
      return this;
    }
  
    bugCount(num) {
      this.bugCount = num;
      return this;
    }
  
    build() {
      return new GamePlayer(
        this.gameDuration, //
        this.carrotCount,
        this.bugCount
      );
    }
  }

export const Reason = Object.freeze ({
    win: "win",
    lose: "lose",
    cancel: "calcel",
});

export class GamePlayer{
    constructor(gameDuration, carrotCount, bugCount){
        /// View Construction
        this.gameDuration = gameDuration;
        this.carrotCount = carrotCount;
        this.bugCount = bugCount;

        console.log("GamePlayer");

        this.field = new GameField(this.carrotCount, this.bugCount);
        this.field.setItemClickListener(item => this.onItemClick(item));

        /// Control Construction
        this.gameBtn = document.querySelector(".game_play");
        this.timerText = document.querySelector(".game_timer");
        this.scoreText = document.querySelector(".game_count");

        this.gameBtn.addEventListener('click', () => {
            if (this.started) {
              this.stop(Reason.cancel);
              sound.playAlert();
            } else {
              this.start();
            }
          });

          this.started = false;
          this.score = 0;
          this.timer = undefined;
    }

    setGameStopListener(onGameStop) {
        this.onGameStop = onGameStop;
    }

    onItemClick(item) {
        if (!this.started) {
          return;
        }

        if (item === ItemType.carrot) {
          this.score++;
          this.updateScoreText(this.score);
    
          if (this.score === this.carrotCount) {
            this.stop(Reason.win);
          }
        } else {
          this.stop(Reason.lose);
        }
      }

    //// Control Paly
    start() {
    this.started = true;
  
    this.initGame();
    this.showStopButton();
    this.showTimerAndScore();
    this.startGameTimer();
    sound.playBackground();
  }
  
  stop(reason) {
    this.started = false;
    this.hideStartButton();
    this.stopGameTimer();
    sound.stopBackground();

    if (reason === Reason.win) {
      sound.playWin();
    } else if (reason === Reason.lose) {
      sound.playLost();
    }
    this.onGameStop && this.onGameStop(reason);
  }

    initGame() {
        this.score = 0;
        this.updateScoreText(this.score);
        this.field.init();
    }

  //// Control Timer
  startGameTimer() {
    let remainTimsec = this.gameDuration;
    this.updateTimerText(remainTimsec);
  
    this.timer = setInterval(() => {
      if (remainTimsec <= 0) {
        clearInterval(this.timer);
        if (this.started) {
            this.stop(this.score === this.carrotCount ? Reason.win : Reason.lose);
          }
          return;
      }
      this.updateTimerText(--remainTimsec);
    }, 1000);
  }
  
  stopGameTimer() {
    clearInterval(this.timer);
  }
  
  //// View Update
  showStartButton() {
    const icon = this.gameBtn.querySelector(".fas");
    icon.classList.remove('fa-stop');
    this.gameBtn.style.visibility = 'visible';
  }
  showStopButton() {
    const icon = this.gameBtn.querySelector('.fas');
    icon.classList.add('fa-stop');
    this.gameBtn.style.visibility = 'visible';
  }

  hideStartButton() {
    this.gameBtn.style.visibility = 'hidden';
  }

  showTimerAndScore() {
    this.timerText.style.visibility = 'visible';
    this.scoreText.style.visibility = 'visible';
  }

  hideTimerAndScore() {
    this.timerText.style.visibility = 'hidden';
    this.scoreText.style.visibility = 'hidden';
  }
   
  updateTimerText(time) {
      // update :: Timer
      const minute = Math.floor(time / 60);
      const second = time % 60;

      // console.log(`update timer = ${time}`);
      this.timerText.innerHTML = `${minute}:${second}`;
  }

  updateScoreText(score) {
      this.scoreText.innerText = score;
      console.log(this.scoreText.innerText);
    }
}

