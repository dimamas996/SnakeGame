export class SnakeGame {
  constructor(isMobile = true) {
    this.isMobile = isMobile;
    this.CNVS = document.querySelector(".canvas");
    this.CNVS_WRAPPER = document.querySelector(".canvas-wrapper");
    this.CTX = this.CNVS.getContext("2d");
    this.MODAl = document.querySelector(".modal");
    this.BTN = document.querySelector(".modal-button");
    this.buttonStylesInfo = {
      upBtn: "rotate(-90deg)",
      downBtn: "rotate(90deg)",
      leftBtn: "rotate(180deg)",
      rightBtn: "rotate(0deg)",
    };
    this.sizeOfSq = 0;
    this.quantityOfSqInRow = 21;
    this.sizeOfSqVisible = 0;
    this.score = 0;
    this.preventAction = false;
    this.gameOver = false;
    this.gameStarted = false;
    this.gameSpeed = 5;
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
    this.action = null;
  }

  init() {
    window.addEventListener("resize", () => {
      if (this.isMobile) {
        Array.from(document.querySelectorAll("button")).forEach((btn) => {
          if (!btn.classList.contains("modal-button")) {
            let property = btn.className.replaceAll("button ", "");
            btn.addEventListener("touchstart", (e) => {
              e.preventDefault();
              this.mobileKeyPress(btn.id);
              btn.style.opacity = "0.7";
              btn.style.transform = `${this.buttonStylesInfo[property]} scale(0.9)`;
            });
            btn.addEventListener("touchend", () => {
              btn.style.opacity = "1";
              btn.style.transform = `${this.buttonStylesInfo[property]} scale(1)`;
            });
          }
        });
        this.BTN.addEventListener("touchend", () => this.newGame());
      }

      this.CNVS.width = this.CNVS_WRAPPER.getBoundingClientRect().width;
      this.CNVS.height = this.CNVS_WRAPPER.getBoundingClientRect().height;
      this.sizeOfSq = this.CNVS.width / this.quantityOfSqInRow;
      this.sizeOfSqVisible = this.sizeOfSq - 2;
    });

    this.BTN.addEventListener("click", () => this.newGame());    

    this.snakeBody.push(
      this.makeSnakePiece(this.snakeHeadPos.x, this.snakeHeadPos.y)
    );

    window.addEventListener("keydown", (e) => {
      console.log("first");
      this.mobileKeyPress(e.code);
    });

    window.dispatchEvent(new Event("resize"));
    this.drawingAll();
    this.action = setTimeout(
      this.gameAction.bind(this),
      Math.floor(1000 / this.gameSpeed)
    );
  }

  gameAction() {
    this.snakeBody.shift();
    this.snakeBody.push(
      this.makeSnakePiece(this.snakeHeadPos.x, this.snakeHeadPos.y)
    );

    this.snakeHeadPos.x += this.snakeDirection.x;
    this.snakeHeadPos.y += this.snakeDirection.y;

    if (this.snakeDirection.prevECode) {
      let target = null;
      if (!this.targets.length) {
        target = this.makeTarget();
      }

      for (let piece of this.snakeBody) {
        if (
          piece.x === this.snakeHeadPos.x &&
          piece.y === this.snakeHeadPos.y
        ) {
          console.log("here1");
          this.endGame();
          break;
        }

        if (target) {
          if (piece.x === target.x && piece.y === target.y) target = null;
        }
      }

      if (target) this.targets.push(target);
    }

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
        this.gameSpeed = Math.ceil(4.976 * Math.pow(this.score, 0.362));
      }
    }

    /*   if (
      this.snakeHeadPos.x < 0 ||
      this.snakeHeadPos.x > 20 ||
      this.snakeHeadPos.y < 0 ||
      this.snakeHeadPos.y > 20
    ) {
      console.log("here2");
      endGame();
    } */

    if (this.snakeHeadPos.x > 20) this.snakeHeadPos.x = 0;
    if (this.snakeHeadPos.x < 0) this.snakeHeadPos.x = 20;
    if (this.snakeHeadPos.y > 20) this.snakeHeadPos.y = 0;
    if (this.snakeHeadPos.y < 0) this.snakeHeadPos.y = 20;

    if (!this.gameOver) {
      console.log("11111");
      this.drawingAll();
      this.action = setTimeout(
        this.gameAction.bind(this),
        Math.floor(1000 / this.gameSpeed)
      );
    }

    this.preventAction = false;
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

  endGame() {
    this.gameOver = true;
    this.MODAl.style.display = "flex";
  }

  drawingAll() {
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
  }

  mobileKeyPress(code) {
    console.log("second");
    if (this.preventAction) return;
    if (this.gameOver) {
      if (code === "Enter") {
        this.newGame();
      } else return;
    }
    this.preventAction = true;
    if (code === this.snakeDirection.prevECode) return;
    if (this.snakeDirection.prevECode === this.snakeDirection.reverse[code])
      return;
    console.log("third");
    switch (code) {
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
      default:
        return;
    }

    this.message = "";
    this.snakeDirection.prevECode = code;
  }

  newGame() {
    this.MODAl.style.display = "none";

    this.score = 0;
    this.preventAction = false;
    this.gameOver = false;
    this.gameStarted = false;
    this.gameSpeed = 5;
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

    this.snakeBody.push(
      this.makeSnakePiece(this.snakeHeadPos.x, this.snakeHeadPos.y)
    );

    window.dispatchEvent(new Event("resize"));
    this.drawingAll();
    this.action = setTimeout(
      this.gameAction.bind(this),
      Math.floor(1000 / this.gameSpeed)
    );
  }
}

/*#282A31 #6F6878 #C4B9B6 #998F07 #35361D Цветовая палитра №4498*/
