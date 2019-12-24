// Tutto in una volta
// import { Engine, UniversalCamera, HemisphericLight, MeshBuilder, Scene, Vector3, Color3, StandardMaterial } from 'babylonjs';
import * as BABYLON from "babylonjs";

// a pezzi
/* import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { GridMaterial } from "@babylonjs/materials/grid";

import "@babylonjs/core/Meshes/meshBuilder"; */


import { createStats } from './debug/stats';
import { createDatGUI } from './debug/datgui';
import { KeyboardState } from './entities/keyboard';
import { Player } from './entities/player';
import { degToRad } from './core/helpers';

import { createMap } from './maps/dm1';


export default class Game {

    constructor(canvas) {
        this.canvas = canvas
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.dt = this.engine.getDeltaTime();

        this.game = {
            state: 'DEV' // MENU, RUNNING, PAUSED, STATS, GAMEOVER, DEV 
        };
    }

    createScene () {

        this.scene = new BABYLON.Scene(this.engine);
        this.scene.collisionsEnabled = true;
        this.scene.gravity = new BABYLON.Vector3(0, -1, 0);

        this.statsFPS = createStats();

        this.player = new Player(this);
        this.keyboard = new KeyboardState(this);
        this.controlOnPointerDown();


        this.powerUp = createMap(this)


        createDatGUI(this); // FIXME: Add DAT GUI after adding model

        // the canvas/window resize event handler
        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        this.step = 0;

        // NOTES: registerBeforeRender funziona solo quando il soggetto è dentro la vista inquadrata dalla camera
        this.scene.registerBeforeRender(() => {

            this.powerUp.position.y = Math.cos(this.step) * 2 + 3
            this.step += 0.075;

        });

        return this;
    }

    controlOnPointerDown () {

        this.scene.onPointerDown = () => {
            if (!this.scene.alreadyLocked) {
                console.log("Requesting pointer lock");
                this.canvas.requestPointerLock = this.canvas.requestPointerLock || this.canvas.msRequestPointerLock || this.canvas.mozRequestPointerLock || this.canvas.webkitRequestPointerLock;
                this.canvas.requestPointerLock();
            } else {
                // console.log("We are already locked");
                if (this.game.state !== 'PAUSED') {
                    this.canvas.addEventListener('mousemove', this.mouseMoveEvent.bind(this));
                    this.canvas.addEventListener('mousedown', this.mouseDownEvent.bind(this));
                    this.canvas.addEventListener('mouseup', this.mouseUpEvent.bind(this));
                    this.canvas.addEventListener('contextmenu', this.contextMenuEvent.bind(this))
                    window.addEventListener('mousewheel', this.mouseWheelEvent.bind(this));
                    window.addEventListener('DOMMouseScroll', this.mouseWheelEvent.bind(this));
                } else if (this.game.state === 'PAUSED') {
                    this.canvas.removeEventListener('mousemove', this.mouseMoveEvent.bind(this));
                    this.canvas.removeEventListener("mousedown", this.mouseDownEvent.bind(this));
                    this.canvas.removeEventListener("mouseup", this.mouseUpEvent.bind(this));
                    this.canvas.removeEventListener('contextmenu', this.contextMenuEvent.bind(this));
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
                this.scene.alreadyLocked = true;
            } else {
                this.scene.alreadyLocked = false;
            }
        }
    }

    mouseDownEvent (e) {
        if (e.button == 0) {
            this.mouseLeft = true
        } else if (e.button == 2) {
            this.mouseRight = true
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
        if (this.scene.alreadyLocked) {
            this.player.camera.playerBox.rotation.y += evt.movementX * 0.001 * (this.player.camera.angularSensibility / 250);
            var nextRotationX = this.player.camera.playerBox.rotation.x + (evt.movementY * 0.001 * (this.player.camera.angularSensibility / 250));
            if (nextRotationX < degToRad(90) && nextRotationX > degToRad(-90)) {
                this.player.camera.playerBox.rotation.x += evt.movementY * 0.001 * (this.player.camera.angularSensibility / 250);
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

    updateDt () {
        this.dt = this.engine.getDeltaTime();
        this.ratio = Math.round(1000 / this.engine.getDeltaTime()) / 60;
        // console.log(this.dt, this.ratio);
    }

    startLoop () {
        this.scene.executeWhenReady(() => {

            // renders the scene 60 fps.
            this.engine.runRenderLoop(() => {

                this.updateDt();

                if (this.keyboard.pressed('p')) {
                    if (this.game.state === 'RUNNING') {
                        this.game.state = 'PAUSED';
                    } else {
                        this.game.state = 'RUNNING';
                    }
                }

                if (this.mouseLeft) {
                    console.log('mouse left!');
                }
                if (this.mouseRight) {
                    console.log('mouse right!');
                }

                /* if (this.keyboard.pressed('F')) {
                    setTimeout(() => {
                        this.player.switchCamera();
                    }, 350);
                } */

                this.keyboard.update();
                // this.keyboard.debug();

                this.player.update(this.ratio)


                if (this.game.state !== 'PAUSED') {
                    this.scene.render();
                }

                this.statsFPS.update();
            })
            return this;
        });
    }

    stop () {
        this.engine.stopRenderLoop();
    }

    restart () {
        this.startLoop();
    }
}