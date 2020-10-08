"use strict";
import PopUp from "./popup.js";
import { GameBuilder, Reason } from "./game.js";

// Build Game
const game = new GameBuilder()
  .gameDuration(10)
  .carrotCount(5)
  .bugCount(5)
  .build();
const gamePopup = new PopUp();

//// Start Game
game.setGameStopListener((reason) => {
  let message;
  switch (reason) {
    case Reason.win:
      message = "YOU WON 🎉";
      break;
    case Reason.lose:
      message = "YOU LOST 💩";
      break;
    case Reason.cancel:
      message = "Replay❓";
      break;
    default:
      throw new Error("not valid reason");
  }
  gamePopup.showWithText(message);
});

gamePopup.setClickListener(() => {
  game.start();
});
