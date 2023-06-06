//Variables
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const text = document.getElementById('txtbereich');
const timer = document.getElementById('timer');

let row = 40;
let col = 50;
let elementSize = 20;
let canvasCols = canvas.width / col;
let canvasRows = canvas.height / row;
let pressSpace = false;
let redWaveSec = 10;
let redWaveMm = 0;
let changeDirection = false;
let increaseNumbBlue = 5;
let countBlue = 0;
let createBlue = true;
let timerStop = false;

let Game = {
    Player: {
        width: 20,
        height: 20,
        x: 25,
        y: 20
    },
    RedSquares: [],
    BlueSquares: [],
    YellowSquares: [
        { x: 5, y: 10 },
        { x: 45, y: 10 },
        { x: 25, y: 15 },
        { x: 5, y: 35 },
        { x: 45, y: 35 }
    ],
    GreenSquares: [
        { x: 25, y: 5 },
        { x: 25, y: 25 },
        { x: 40, y: 30 },
        { x: 25, y: 35 },
        { x: 10, y: 30 }
    ],
    GreySquares: [
        { x: 10, y: 20 },
        { x: 25, y: 10 },
        { x: 40, y: 20 }
    ],
    //Game-Functions
    MovePlayer: function () {
        document.addEventListener('keydown', (e) => {
            if (e.key == 'ArrowLeft') {
                Game.Player.x--;
            } else if (e.key == 'ArrowRight') {
                Game.Player.x++;
            } else if (e.key == 'ArrowDown') {
                Game.Player.y++;
            } else if (e.key == 'ArrowUp') {
                Game.Player.y--;
            } else if (e.keyCode == 32) {
                pressSpace = true;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.keyCode == 32) {
                pressSpace = false;
            }
        });
    },
    CreateRedSquares: () => {
        let Red_Child = {
            x: Math.floor(Math.random() * col - 2),
            y: -10
        };

        Game.RedSquares.push(Red_Child);

        Game.RedSquares.forEach(element => {
            element.y++;
        });
    },
    CreateBlueSquares: () => {
        let Blue_Child = {
            x: 3,
            y: 3
        }

        createBlue ? Game.BlueSquares.push(Blue_Child) : "";

        Game.BlueSquares.forEach(element => {
            if (element.x >= col - increaseNumbBlue) {
                changeDirection = true;
            } else if (element.x == increaseNumbBlue) {
                changeDirection = false;
            }

            if (element.x == increaseNumbBlue && element.y == increaseNumbBlue) {
                increaseNumbBlue = increaseNumbBlue + 5;
            }

            if (!changeDirection) {
                element.y < row - increaseNumbBlue ? element.y++ : element.x++;
            } else if (changeDirection) {
                element.y > increaseNumbBlue ? element.y-- : element.x--;
            }
        });

        createBlue = false;
    },
    StartTimerRed: () => {
        if (redWaveMm == 0) {
            redWaveSec--
            redWaveMm = 9;
        } else {
            redWaveMm--;
        }

        redWaveMm = ('0' + redWaveMm).slice(-2);
        redWaveSec = ('0' + redWaveSec).slice(-2);

        text.innerHTML = `Survive this wave for ${redWaveSec}:${redWaveMm} seconds`;
    },
    Check: () => {
        if (Game.Player.x < 0 ||
            Game.Player.y < 0 ||
            Game.Player.x >= col - 1 ||
            Game.Player.y > row - 2) {
            Game.EndGame();
        }

        if (pressSpace) {
            Game.YellowSquares.forEach(element => {
                if (element.x == Game.Player.x && element.y == Game.Player.y) {
                    Game.YellowSquares = Game.YellowSquares.filter(elements => elements != element);
                }
            });

            Game.GreenSquares.forEach(element => {
                if (element.x == Game.Player.x && element.y == Game.Player.y && Game.YellowSquares.length == 0) {
                    Game.GreenSquares = Game.GreenSquares.filter(elements => elements != element);
                }
            });

            Game.GreySquares.forEach(element => {
                if (element.x == Game.Player.x && element.y == Game.Player.y && Game.YellowSquares.length == 0) {
                    Game.GreySquares = Game.GreySquares.filter(elements => elements != element);
                }
            });

            Game.BlueSquares.forEach(element => {
                if (element.x == Game.Player.x && element.y == Game.Player.y) {
                    countBlue++;

                    if (countBlue == 5) {
                        Game.BlueSquares.pop();
                        Game.EndGame();
                    }
                }
            });
        }

        if (Game.GreenSquares.length == 0 && Game.GreySquares.length != 0) {
            Game.CreateRedSquares();
            redWaveSec > 0 ? Game.StartTimerRed() : "";

            Game.RedSquares.forEach(element => {
                if ((element.x == Game.Player.x + 1 && element.y == Game.Player.y + 1) ||
                    (element.x == Game.Player.x - 1 && element.y == Game.Player.y + 1) ||
                    (element.x == Game.Player.x && element.y == Game.Player.y)) {
                    Game.EndGame();
                }
            });
        } else {
            Game.RedSquares.pop();
        }

        if (Game.GreySquares.length == 0) {
            Game.CreateBlueSquares();
        }
    },
    AddCtx: (x, y, width, height, color) => {
        ctx.fillStyle = color;
        ctx.fillRect(x * canvasCols, y * canvasRows, width, height);
    },
    Draw: () => {
        Game.AddCtx(0, 0, canvas.width, canvas.height, 'black');

        Game.YellowSquares.forEach(element => {
            Game.AddCtx(element.x, element.y, elementSize, elementSize, 'yellow');
        });

        Game.GreenSquares.forEach(element => {
            Game.AddCtx(element.x, element.y, elementSize, elementSize, 'green');
        });

        if (redWaveSec < 1 && !timerStop) {
            Game.GreySquares.forEach(element => {
                Game.AddCtx(element.x, element.y, elementSize, elementSize, 'grey');
            });

            text.innerHTML = 'You must collect the gray squares to permanently stop the red wave!';
        }

        Game.BlueSquares.forEach(element => {
            Game.AddCtx(element.x, element.y, elementSize, elementSize, 'blue');

            if (element.x < 0) {
                text.innerHTML = 'You lost, the blue square has escaped! Restart the game.';
            } else if (!timerStop) {
                text.innerHTML = `You must click the blue square 5 times to win the game! Counter: ${5 - countBlue}`;
            }
        });

        Game.AddCtx(Game.Player.x, Game.Player.y, Game.Player.width, Game.Player.height, 'blue');

        Game.RedSquares.forEach(element => {
            Game.AddCtx(element.x, element.y, elementSize, elementSize, 'red');
        });

        requestAnimationFrame(Game.Draw);
    },
    StartTimer: () => {
        let min = 0,
            sec = 0;

        setInterval(() => {
            if (!timerStop) {
                sec++;

                if (sec == 60) {
                    min++;
                    sec = 0;
                }

                sec = ('0' + sec).slice(-2);
                min = ('0' + min).slice(-2);

                timer.innerHTML = `Record-Timer: ${min}:${sec}`;
            }
        }, 1000);
    },
    Start: () => {
        setInterval(function () {
            if (!timerStop) {
                Game.Check();
                Game.Draw();
            } else {
                Game.RedSquares.pop();
                Game.YellowSquares.pop();
                Game.GreenSquares.pop();
                Game.GreySquares.pop();
            }
        }, 100);

        Game.StartTimer();
        Game.MovePlayer();
    },
    EndGame: () => {
        timerStop = true;
        Object.freeze(Game.Player);

        countBlue === 5 ? (text.innerHTML = 'You won!') : (text.innerHTML = 'You lost! Restart the game.');
    }
};

Game.Start();