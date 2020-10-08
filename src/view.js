"use strict";

import * as sound from "./sound.js";

const CARROT_SIZE = 80;

export const ItemType = Object.freeze({
  carrot: 'carrot',
  bug: 'bug',
});

export class GameField {
  constructor(carrotCount, bugCount) {
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.field = document.querySelector(".game_field");
    this.fieldRect = this.field.getBoundingClientRect();

    this.onFieldClickListener = this.onFieldClickListener.bind(this);
    this.field.addEventListener("click", this.onFieldClickListener);
  }

  init() {
    this.field.innerHTML = ``;

    this._addItem("carrot", this.carrotCount, "img/carrot.png");
    this._addItem("bug", this.bugCount, "img/bug.png");
  }

  _addItem(className, count, imgPath) {
    const x1 = 0;
    const y1 = 0;
    const x2 = this.fieldRect.width - CARROT_SIZE;
    const y2 = this.fieldRect.height - CARROT_SIZE;

    for (let i = 0; i < count; i++) {
      const item = document.createElement("img");
      item.setAttribute("class", className);
      item.setAttribute("src", imgPath);
      item.style.position = "absolute";

      const x = this.randomNumber(x1, x2);
      const y = this.randomNumber(y1, y2);

      // console.log(`x = ${x}, y=${y}`);

      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      this.field.appendChild(item);
    }
  }

  randomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  setItemClickListener(onItemClick) {
    this.onItemClick = onItemClick;
  }

  onFieldClickListener(event) {
    const target = event.target;

    if (target.matches(".carrot")) {
      sound.playCarrot();
      target.remove();
      this.onItemClick && this.onItemClick(ItemType.carrot);
    } else if (target.matches(".bug")) {
      this.onItemClick && this.onItemClick(ItemType.bug);
    }
  }
}

