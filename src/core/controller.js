import { Helper } from './helper';

export class ControlHandler {

    constructor(game) {
        this.game = game;
        this.canvas = game.canvas;
        this.camera = game.camera;
        this.player = game.player;

        this.canvas.addEventListener('keydown', this.keyDownEvent.bind(this));
        this.canvas.addEventListener('keyup', this.keyUpEvent.bind(this));
        this.canvas.addEventListener('mousedown', this.mouseDownEvent.bind(this));
        this.canvas.addEventListener('mouseup', this.mouseUpEvent.bind(this));
        this.canvas.addEventListener('mousemove', this.mouseMoveEvent.bind(this));
        this.canvas.addEventListener('contextmenu', this.contextMenuEvent.bind(this))
        window.addEventListener('mousewheel', this.mouseWheelEvent.bind(this));
        window.addEventListener('DOMMouseScroll', this.mouseWheelEvent.bind(this));
    }

    keyDownEvent(e) {
        if (e.keyCode == 87) {
            this.w = true
        } else if (e.keyCode == 83) {
            this.s = true
        } else if (e.keyCode == 65) {
            this.a = true
        } else if (e.keyCode == 68) {
            this.d = true
        } else if ((e.keyCode >= 48 || e.keyCode <= 57) && this.game.state == 'game') {
            this.player.hotKey(e.keyCode)
        }
        /* if (this.mouseX > 0 && this.mouseX < this.canvas.width && this.mouseY > 0 && this.mouseY < this.canvas.height) {
            e.preventDefault();
            return false
        } */
    }

    keyUpEvent(e) {
        if (e.keyCode == 87 || e.keyCode == 38) {
            this.w = false
        } else if (e.keyCode == 83) {
            this.s = false
        } else if (e.keyCode == 65) {
            this.a = false
        } else if (e.keyCode == 66) {
            this.back2Player = !this.back2Player;
            this.followBot(this.back2Player);
        } else if (e.keyCode == 68) {
            this.d = false
        } else if (e.keyCode == 71) {   // g
            this.game.player.godMode = !this.game.player.godMode;
        } else if (e.keyCode == 73) {     // i per debug
            this.game.debug = !this.game.debug;
        } else if (e.keyCode == 80) {
            if (!this.game.paused) {    // se non è già in pausa...
                this.game.paused = !this.game.paused;
                if (this.game.paused) {
                    this.game.loadPauseScreen(this.game);
                }
            }
        } /* else if (this.mouseX > 0 && this.mouseX < this.canvas.width && this.mouseY > 0 && this.mouseY < this.canvas.height) {
            e.preventDefault();
            return false
        } */
    }

    // TODO: permette di ciclare tra i bot
    followBot(back) {
        const botIndex = Helper.getBotsName(this.game.enemy.list.map(e => e.index));  // FIXME: è usato sia per i nomi che per l'index
        let currentActorInCamera = back ? this.player : this.game.enemy.list[botIndex];
        // this.game.camera.setCurrentPlayer(currentActorInCamera);
    }

    mouseDownEvent(e) {
        if (e.button == 0) {
            this.mouseLeft = true
        } else if (e.button == 2) {
            this.mouseRight = true
        }
    }

    mouseUpEvent(e) {
        if (this.mouseLeft) {
            /* if (this.game.state == 'menuScreen') {
                // this.game.startGame();
                console.log(e);
            } */
            if (this.game.state==='PAUSE') {
                this.game.state = false;
            }
            /* if (this.game.state == 'statsScreen') {
                this.game.startGame();
            } */
        }

        if (e.button == 0) {
            this.mouseLeft = false;
        } else if (e.button == 2) {
            this.mouseRight = false;
        }
    }

    mouseMoveEvent(e) {
        // var rect = this.canvas.getBoundingClientRect();
        // this.mouseX = e.clientX - rect.left;    // tra 0 e 800
        // this.mouseY = e.clientY - rect.top;     // tra 0 e 600
        // // angolo tra il player e il mirino
        // this.player.angle = Helper.calculateAngle(this.player.x - this.camera.x, this.player.y - this.camera.y, this.mouseX, this.mouseY);
    }

    mouseWheelEvent(e) {
        if (this.game.state == 'game') {
            this.player.wheel(e.wheelDelta ? e.wheelDelta : -e.detail);
            return true;
        }
        if (this.mouseX > 0 && this.mouseX < this.canvas.width && this.mouseY > 0 && this.mouseY < this.canvas.height) {
            e.preventDefault();
            return false
        }
    }

    contextMenuEvent(e) {
        e.preventDefault()
    }

}

