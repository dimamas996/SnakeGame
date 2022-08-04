export class SnakeGame {
  constructor(isMobile = true) {
    this.isMobile = isMobile;
    this.CNVS = document.querySelector(".canvas");
    this.CNVS_WRAPPER = document.querySelector(".canvas-wrapper");
    this.MAIN = document.querySelector(".main");
    this.CTX = this.CNVS.getContext("2d");
    this.MODAl = document.querySelector(".modal");
    this.BTN = document.querySelector(".modal-button");
    this.sizeOfSq = 0;
    this.quantityOfSqInRow = 23;
    this.sizeOfSqVisible = 0;
    this.score = 0;
    this.currentAction = null;
    this.gameOver = false;
    this.gameStarted = false;
    this.action = null;
    this.gameSpeed = 7;
    this.message = this.isMobile
      ? "Swipe in any direction to start the game."
      : "Press any arrow button to start the game.";
    this.title = "SNAKE GAME";
    this.snakeDirection = {
      prevECode: null,
      x: 0,
      y: 0,
      reverse: {
        ArrowUp: "ArrowDown",
        ArrowDown: "ArrowUp",
        ArrowRight: "ArrowLeft",
        ArrowLeft: "ArrowRight",
      },
    };
    this.snakeHeadPos = {
      x: Math.floor(this.quantityOfSqInRow / 2),
      y: Math.floor(this.quantityOfSqInRow / 2),
    };
    this.snakeBody = [];
    this.targets = [];
    this.#init();
  }

  #init() {
    window.addEventListener("resize", () => {
      let length = 0;
      if (window.screen.width > window.screen.height) {
        length = this.MAIN.getBoundingClientRect().height;
      } else {
        length = this.MAIN.getBoundingClientRect().width;
      }

      length =
        length -
        length * 0.06 -
        ((length - length * 0.06) % this.quantityOfSqInRow);

      this.CNVS_WRAPPER.style.width = `${length}px`;
      this.CNVS_WRAPPER.style.height = `${length}px`;

      this.CNVS.width = this.CNVS_WRAPPER.getBoundingClientRect().width;
      this.CNVS.height = this.CNVS_WRAPPER.getBoundingClientRect().height;
      this.sizeOfSq = this.CNVS.width / this.quantityOfSqInRow;
      this.sizeOfSqVisible = this.sizeOfSq - 2;
    });

    if (this.isMobile) {
      document.body.addEventListener('swiped', (e) => {
        let swipeDirection = {
          up: "ArrowUp",
          down: "ArrowDown",
          left: "ArrowLeft",
          right: "ArrowRight",          
        }

        this.keyPress(swipeDirection[e.detail.dir]);
      });

      this.BTN.addEventListener("touchstart", () => {
        this.BTN.style.opacity = 0.7;
        this.BTN.style.transform = "scale(0.9)";
      });
      this.BTN.addEventListener("touchend", () => {
        this.BTN.style.opacity = 1;
        this.BTN.style.transform = "scale(1)";
        this.newGame();
      });
    } else {
      this.BTN.addEventListener("mouseup", () => this.newGame());

      window.addEventListener("keydown", (e) => {
        this.keyPress(e.code);
      });
    }

    this.snakeBody.push(
      this.makeSnakePiece(this.snakeHeadPos.x, this.snakeHeadPos.y)
    );

    window.dispatchEvent(new Event("resize"));
    this.animation();
  }

  gameAction() {
    this.readStep();

    this.snakeBody.shift();
    this.snakeBody.push(
      this.makeSnakePiece(this.snakeHeadPos.x, this.snakeHeadPos.y)
    );

    this.snakeHeadPos.x += this.snakeDirection.x;
    this.snakeHeadPos.y += this.snakeDirection.y;

    let target = null;
    if (!this.targets.length) {
      target = this.makeTarget();
    }

    for (let piece of this.snakeBody) {
      if (piece.x === this.snakeHeadPos.x && piece.y === this.snakeHeadPos.y) {
        this.endGame("headstrike");
        break;
      }

      if (target) {
        if (piece.x === target.x && piece.y === target.y) target = null;
      }
    }

    if (target) this.targets.push(target);

    for (let target of this.targets) {
      if (
        target.x === this.snakeHeadPos.x &&
        target.y === this.snakeHeadPos.y
      ) {
        this.targets.pop();
        this.snakeBody.push(
          this.makeSnakePiece(this.snakeHeadPos.x, this.snakeHeadPos.y)
        );
        this.score++;
        this.speedChange();
      }
    }

    if (
      this.snakeHeadPos.x < 0 ||
      this.snakeHeadPos.x > this.quantityOfSqInRow - 1 ||
      this.snakeHeadPos.y < 0 ||
      this.snakeHeadPos.y > this.quantityOfSqInRow - 1
    ) {
      this.endGame("walltrike");
    }

    if (this.snakeHeadPos.x > this.quantityOfSqInRow - 1)
      this.snakeHeadPos.x = 0;
    if (this.snakeHeadPos.x < 0)
      this.snakeHeadPos.x = this.quantityOfSqInRow - 1;
    if (this.snakeHeadPos.y > this.quantityOfSqInRow - 1)
      this.snakeHeadPos.y = 0;
    if (this.snakeHeadPos.y < 0)
      this.snakeHeadPos.y = this.quantityOfSqInRow - 1;
  }

  speedChange() {
    let newSpeed = this.gameSpeed;
    if (this.score >= 10 && this.score < 15) newSpeed = 9;
    if (this.score >= 15 && this.score < 20) newSpeed = 10;
    if (this.score >= 20) newSpeed = 11;

    if (newSpeed !== this.gameSpeed) {
      this.gameSpeed = newSpeed;
      clearInterval(this.action);
      this.action = setInterval(
        this.gameAction.bind(this),
        1000 / this.gameSpeed
      );
    }
  }

  makeSnakePiece(x, y) {
    return { x: x, y: y };
  }

  makeTarget() {
    return {
      x: Math.floor(Math.random() * (this.quantityOfSqInRow - 2) + 1),
      y: Math.floor(Math.random() * (this.quantityOfSqInRow - 2) + 1),
    };
  }

  drawSquare(x, y, color) {
    this.CTX.fillStyle = color;
    this.CTX.fillRect(
      x * this.sizeOfSq + 1,
      y * this.sizeOfSq + 1,
      this.sizeOfSqVisible,
      this.sizeOfSqVisible
    );
  }

  endGame(text) {
    console.log(text);
    this.gameOver = true;
    clearInterval(this.action);
    this.MODAl.style.display = "flex";
    this.BTN.innerHTML = `Your score is ${this.score}.<br>Tap here to start a new game.`;
  }

  startGame() {
    this.gameStarted = true;
    this.action = setInterval(
      this.gameAction.bind(this),
      1000 / this.gameSpeed
    );
  }

  animation() {
    if (this.gameOver) return;
    this.CTX.clearRect(0, 0, this.CNVS.width, this.CNVS.height);

    for (let piece of this.snakeBody) {
      this.drawSquare(piece.x, piece.y, "#C4B9B6");
    }
    for (let target of this.targets) {
      this.drawSquare(target.x, target.y, "red");
    }
    this.drawSquare(this.snakeHeadPos.x, this.snakeHeadPos.y, "#998F07");

    this.CTX.fillStyle = "#c4b9b6";
    this.CTX.font = `${this.sizeOfSq}px Arial`;
    this.CTX.textAlign = "right";
    this.CTX.fillText(
      `Score: ${this.score}`,
      this.CNVS.width * 0.95,
      this.CNVS.height * 0.05
    );

    this.CTX.textAlign = "center";
    this.CTX.fillText(
      `${this.title}`,
      this.CNVS.width / 2,
      this.CNVS.height * 0.35
    );

    this.CTX.textAlign = "center";
    this.CTX.fillText(
      `${this.message}`,
      this.CNVS.width / 2,
      this.CNVS.height * 0.65
    );

    requestAnimationFrame(this.animation.bind(this));
  }

  keyPress(code) {
    if (!this.gameStarted) {
      switch (code) {
        case "ArrowUp":
        case "ArrowRight":
        case "ArrowDown":
        case "ArrowLeft":
          this.currentAction = code;
          this.snakeDirection.prevECode = code;
          break;
        default:
          return;
      }
      this.startGame();
      this.gameStarted = true;
      this.message = "";
      this.title = "";
    } else {
      switch (code) {
        case "ArrowUp":
        case "ArrowRight":
        case "ArrowDown":
        case "ArrowLeft":
          this.currentAction = code;
          break;
        case "Enter":
          if (this.MODAl.style.display === "flex") {
            this.newGame();
          }
          break;
        default:
          return;
      }
    }
  }

  readStep() {
    if (
      this.currentAction ===
      this.snakeDirection.reverse[this.snakeDirection.prevECode]
    ) {
      this.currentAction = this.snakeDirection.prevECode;
    }

    switch (this.currentAction) {
      case "ArrowUp":
        this.snakeDirection.x = 0;
        this.snakeDirection.y = -1;
        break;
      case "ArrowRight":
        this.snakeDirection.x = 1;
        this.snakeDirection.y = 0;
        break;
      case "ArrowDown":
        this.snakeDirection.x = 0;
        this.snakeDirection.y = 1;
        break;
      case "ArrowLeft":
        this.snakeDirection.x = -1;
        this.snakeDirection.y = 0;
        break;
    }

    this.snakeDirection.prevECode = this.currentAction;
  }

  newGame() {
    console.log("newGame");
    this.MODAl.style.display = "none";
    this.score = 0;
    this.currentAction = null;
    this.gameOver = false;
    this.gameStarted = false;
    this.gameSpeed = 7;
    this.message = "Press any arrow button to start the game.";
    this.title = "SNAKE GAME";
    this.snakeDirection.x = 0;
    this.snakeDirection.y = 0;
    this.snakeDirection.prevECode = null;
    this.snakeHeadPos = {
      x: Math.floor(this.quantityOfSqInRow / 2),
      y: Math.floor(this.quantityOfSqInRow / 2),
    };
    this.snakeBody = [];
    this.targets = [];

    this.snakeBody.push(
      this.makeSnakePiece(this.snakeHeadPos.x, this.snakeHeadPos.y)
    );

    this.animation();
    console.clear();
  }
}

/*#282A31 #6F6878 #C4B9B6 #998F07 #35361D Цветовая палитра №4498*/
