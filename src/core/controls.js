import { degToRad } from './helpers';

export class Controls {

    constructor(game) {
        this.game = game;
        this.status = {};
        this.keys = {
            8: "backspace", 9: "tab", 13: "enter", 16: "shift",
            17: "ctrl", 18: "alt", 27: "esc", 32: "space",
            33: "pageup", 34: "pagedown", 35: "end", 36: "home",
            37: "left", 38: "up", 39: "right", 40: "down",
            45: "insert", 46: "delete", 80: 'p', 186: ";", 187: "="
        };
        // bind keyEvents
        document.addEventListener("keydown", this.onKeyDown.bind(this), false);
        document.addEventListener("keyup", this.onKeyUp.bind(this), false);
    }

    keyName (keyCode) {
        return (this.keys[keyCode] != null) ?
            this.keys[keyCode] :
            String.fromCharCode(keyCode);
    }

    onKeyUp (event) {
        var key = this.keyName(event.keyCode);
        if (this.status[key])
            this.status[key].pressed = false;
    }

    onKeyDown (event) {
        var key = this.keyName(event.keyCode);
        if (!this.status[key])
            this.status[key] = { down: false, pressed: false, up: false, updatedPreviously: false };
    }

    update () {
        for (var key in this.status) {
            // insure that every keypress has "down" status exactly once
            if (!this.status[key].updatedPreviously) {
                this.status[key].down = true;
                this.status[key].pressed = true;
                this.status[key].updatedPreviously = true;
                // updated previously
            } else {
                this.status[key].down = false;
            }
            // key has been flagged as "up" since last update
            if (this.status[key].up) {
                delete this.status[key];
                continue; // move on to next key
            }
            if (!this.status[key].pressed) // key released
                this.status[key].up = true;
        }
    }

    down (keyName) {
        return (this.status[keyName] && this.status[keyName].down);
    }

    pressed (keyName) {
        return (this.status[keyName] && this.status[keyName].pressed);
    }

    up (keyName) {
        return (this.status[keyName] && this.status[keyName].up);
    }

    debug () {
        var list = "Keys active: ";
        for (var arg in this.status)
            list += " " + arg
        console.log(list);
    }

    controlOnPointerDown () {

        this.game.scene.onPointerDown = () => {
            if (!this.game.scene.alreadyLocked) {
                console.log("Requesting pointer lock");
                this.game.canvas.requestPointerLock = this.game.canvas.requestPointerLock || this.game.canvas.msRequestPointerLock || this.game.canvas.mozRequestPointerLock || this.game.canvas.webkitRequestPointerLock;
                this.game.canvas.requestPointerLock();
            } else {
                // console.log("We are already locked");
                if (this.game.state !== 'PAUSED') {
                    this.game.canvas.addEventListener('mousemove', this.mouseMoveEvent.bind(this));
                    this.game.canvas.addEventListener('mousedown', this.mouseDownEvent.bind(this));
                    this.game.canvas.addEventListener('mouseup', this.mouseUpEvent.bind(this));
                    this.game.canvas.addEventListener('contextmenu', this.contextMenuEvent.bind(this))
                    window.addEventListener('mousewheel', this.mouseWheelEvent.bind(this));
                    window.addEventListener('DOMMouseScroll', this.mouseWheelEvent.bind(this));
                } else if (this.game.state === 'PAUSED') {
                    this.game.canvas.removeEventListener('mousemove', this.mouseMoveEvent.bind(this));
                    this.game.canvas.removeEventListener("mousedown", this.mouseDownEvent.bind(this));
                    this.game.canvas.removeEventListener("mouseup", this.mouseUpEvent.bind(this));
                    this.game.canvas.removeEventListener('contextmenu', this.contextMenuEvent.bind(this));
                    window.removeEventListener('mousewheel', this.mouseWheelEvent.bind(this));
                    window.removeEventListener('DOMMouseScroll', this.mouseWheelEvent.bind(this));
                }
            }
        }

        document.addEventListener("pointerlockchange", pointerLockListener.bind(this));
        document.addEventListener("mspointerlockchange", pointerLockListener.bind(this));
        document.addEventListener("mozpointerlockchange", pointerLockListener.bind(this));
        document.addEventListener("webkitpointerlockchange", pointerLockListener.bind(this));

        function pointerLockListener () {
            var element = document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement || document.pointerLockElement || null;
            if (element) {
                this.game.scene.alreadyLocked = true;
            } else {
                this.game.scene.alreadyLocked = false;
            }
        }
    }

    mouseDownEvent (e) {
        if (e.button == 0) {
            this.mouseLeft = true;
        } else if (e.button == 2) {
            this.mouseRight = true;
        }
    }

    mouseUpEvent (e) {
        if (e.button == 0) {
            this.mouseLeft = false;
        } else if (e.button == 2) {
            this.mouseRight = false;
        }
    }

    mouseMoveEvent (evt) {
        if (this.game.scene.alreadyLocked) {
            this.game.player.camera.playerBox.rotation.y += evt.movementX * 0.001 * (this.game.player.camera.angularSensibility / 250);
            var nextRotationX = this.game.player.camera.playerBox.rotation.x + (evt.movementY * 0.001 * (this.game.player.camera.angularSensibility / 250));
            if (nextRotationX < degToRad(90) && nextRotationX > degToRad(-90)) {
                this.game.player.camera.playerBox.rotation.x += evt.movementY * 0.001 * (this.game.player.camera.angularSensibility / 250);
            }
        }
    }

    mouseWheelEvent (e) {
        if (this.game.state == 'game') {
            this.player.wheel(e.wheelDelta ? e.wheelDelta : -e.detail);
            return true;
        }
    }

    contextMenuEvent (e) {
        e.preventDefault()
    }


}