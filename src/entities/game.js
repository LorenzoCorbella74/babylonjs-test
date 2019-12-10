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

import { createCamera } from './camera';
import { createStats } from '../debug/stats';
import { createDatGUI } from '../debug/datgui';

import { KeyboardState } from './keyboard';


export default class Game {

    constructor(canvas) {
        this.canvas = canvas
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.dt = this.engine.getDeltaTime();

        this.game = {
            state: 'DEV' // RUNNING, PAUSE, GAMEOVER, DEV 
        };

    }

    createScene () {

        this.scene = new BABYLON.Scene(this.engine)

        this.statsFPS = createStats();

        this.keyboard = new KeyboardState();

        this.controlOnPointerDown();

        // camera
        this.camera = createCamera(this.scene, this.canvas);

        // Light
        const lightPos = new BABYLON.Vector3(0, 5, 0)
        this.light = new BABYLON.HemisphericLight('hemlight', lightPos, this.scene)
        this.light.intensity = 0.95;

        // Create a grid material
        // var gridMaterial = new GridMaterial("grid", this.scene);
        this.myMaterial = new BABYLON.StandardMaterial("myMaterial", this.scene);
        this.myMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.4, 0.6);
        this.myMaterial.wireframe = false;

        // SPHERE
        const sphereOpts = { segments: 16, diameter: 2 }
        this.powerUp = BABYLON.MeshBuilder/* Mesh */.CreateSphere('mainsphere', sphereOpts, this.scene)
        this.powerUp.position.y = 1;
        const powerMat = new BABYLON.StandardMaterial("powerMat", this.scene);
        powerMat.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.7);
        powerMat.alpha = 0.5;
        powerMat.wireframe = false;
        this.powerUp.material = powerMat;
        this.powerUp.checkCollisions = true;
        this.powerUp.collisionsEnabled = true;

        // GROUND
        const groundOpts = { width: 60, height: 60, subdividions: 2 }
        const ground = BABYLON.MeshBuilder/* Mesh */.CreateGround('mainground', groundOpts, this.scene);
        ground.wireframe = false;
        ground.material = this.myMaterial;
        ground.checkCollisions = true;

        createDatGUI(this); // FIXME: Add DAT GUI after adding model

        // the canvas/window resize event handler
        window.addEventListener('resize', () => {
            this.engine.resize();
        });



        this.step = 0;


        this.scene.registerBeforeRender(() => {

 

            this.powerUp.position.y = Math.cos(this.step) * 2 + 2
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
                console.log("We are already locked");
            }
            /* if (this.game.state !== 'PAUSE') {
                this.canvas.addEventListener("mousedown", this.player.shoot());
                this.canvas.addEventListener("keypress", this.player.move());
            }
            else if (this.game.state === 'PAUSE') {
                this.canvas.removeEventListener("mousedown", this.player.shoot());
                this.canvas.removeEventListener("keypress", this.player.move());
            } */
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
                /* this.canvas.removeEventListener("mousedown", this.player.shoot());
                this.canvas.removeEventListener("keypress", this.player.move()); */
            }
        }
    }

    updateDt () {
        this.dt = this.engine.getDeltaTime();
        // console.log(this.dt);
    }

    startLoop () {
        this.scene.executeWhenReady(() => {

            // renders the scene 60 fps.
            this.engine.runRenderLoop(() => {

                if(this.keyboard.pressed('p')){
                    if(this.game.state === 'RUNNING'){
                        this.game.state = 'PAUSE';
                    } else {
                        this.game.state = 'RUNNING';
                    }
                }
                
                this.updateAll(); // update stats

                if(this.game.state !=='PAUSE'){
                    this.scene.render();
                }
            })
            return this;
        });
    }

    updateAll () {
        this.updateDt();
        this.keyboard.update();
        // this.keyboard.debug();
        this.statsFPS.update();
    }

    stop () {
        this.engine.stopRenderLoop();
    }

    restart () {
        this.startLoop();
    }
}