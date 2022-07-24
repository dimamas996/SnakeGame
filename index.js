export class SnakeGame {
  constructor(isMobile = true) {
    this.isMobile = isMobile;
    this.CNVS = document.querySelector(".canvas");
    this.CNVS_WRAPPER = document.querySelector(".canvas-wrapper");
    this.CTX = this.CNVS.getContext("2d");
    this.MODAl = document.querySelector(".modal");
    this.BTN = document.querySelector(".modal-button");
    this.sizeOfSq = 0;
    this.quantityOfSqInRow = 21;
    this.sizeOfSqVisible = 0;
    this.score = 0;
    this.currentAction = null;
    this.gameOver = false;
    this.gameStarted = false;
    this.action = null;
    this.gameSpeed = 7;
    this.message = "Press any arrow button to start the game.";
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
      x: 10,
      y: 10,
    };
    this.snakeBody = [];
    this.targets = [];
  }

  init() {
    window.addEventListener("resize", () => {
      this.CNVS.width = this.CNVS_WRAPPER.getBoundingClientRect().width;
      this.CNVS.height = this.CNVS_WRAPPER.getBoundingClientRect().height;
      this.sizeOfSq = this.CNVS.width / this.quantityOfSqInRow;
      this.sizeOfSqVisible = this.sizeOfSq - 2;
    });

    if (this.isMobile) {
      Array.from(document.querySelectorAll("button")).forEach((btn) => {
        if (!btn.classList.contains("modal-button")) {
          btn.addEventListener("touchstart", (e) => {
            e.preventDefault();
            this.keyPress(btn.id);
            btn.style.opacity = "0.7";
            btn.style.transform = `scale(0.9)`;
          });
          btn.addEventListener("touchend", () => {
            btn.style.opacity = "1";
            btn.style.transform = `scale(1)`;
          });
        }
      });
      this.BTN.addEventListener("touchend", () => this.newGame());
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
      this.snakeHeadPos.x > 20 ||
      this.snakeHeadPos.y < 0 ||
      this.snakeHeadPos.y > 20
    ) {
      this.endGame("walltrike");
    }

    if (this.snakeHeadPos.x > 20) this.snakeHeadPos.x = 0;
    if (this.snakeHeadPos.x < 0) this.snakeHeadPos.x = 20;
    if (this.snakeHeadPos.y > 20) this.snakeHeadPos.y = 0;
    if (this.snakeHeadPos.y < 0) this.snakeHeadPos.y = 20;
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
      x: Math.floor(Math.random() * 19 + 1),
      y: Math.floor(Math.random() * 19 + 1),
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
    this.BTN.innerText = `Your score is ${this.score}. Tap here to start a new game.`;
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

    this.CTX.fillStyle = "#c4b9b6";
    this.CTX.font = `${this.sizeOfSq}px Arial`;
    this.CTX.textAlign = "center";
    this.CTX.fillText(
      `${this.message}`,
      this.CNVS.width / 2,
      this.CNVS.height * 0.35
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
    } else {
      switch (code) {
        case "ArrowUp":
        case "ArrowRight":
        case "ArrowDown":
        case "ArrowLeft":
          this.currentAction = code;
          break;
        default:
          return;
      }
    }
    /*     if (code === this.snakeDirection.prevECode) return;
    if (this.snakeDirection.prevECode === this.snakeDirection.reverse[code])
      return;
    switch (code) {
      case "ArrowUp":
        this.currentAction = code;
        break;
      case "ArrowRight":
        this.currentAction = code;
        break;
      case "ArrowDown":
        this.currentAction = code;
        break;
      case "ArrowLeft":
        this.currentAction = code;
        break;
      default:
        return;
    }*/


    //this.snakeDirection.prevECode = code;
  }

  readStep() {
    if (this.currentAction === this.snakeDirection.reverse[this.snakeDirection.prevECode]) {
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
    this.snakeDirection.x = 0;
    this.snakeDirection.y = 0;
    this.snakeDirection.prevECode = null;
    this.snakeHeadPos = {
      x: 10,
      y: 10,
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
