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


import { createStats } from '../debug/stats';
import { createDatGUI } from '../debug/datgui';
import { KeyboardState } from './keyboard';
import { Player } from './player';
import { degToRad } from './helpers';


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

        this.scene = new BABYLON.Scene(this.engine);
        this.scene.collisionsEnabled = true;
        this.scene.gravity = new BABYLON.Vector3(0, -1, 0);



        this.statsFPS = createStats();

        this.keyboard = new KeyboardState();

        this.controlOnPointerDown();

        this.player = new Player(this);

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
        BABYLON.Tags.EnableFor(ground);
        ground.addTags("floor");


        // rampa estrusa
        const bodyMaterial = new BABYLON.StandardMaterial("texture_rampa", this.scene);
        bodyMaterial.diffuseColor = new BABYLON.Color3(1.0, 0.75, 0.75);
        bodyMaterial.backFaceCulling = false;
        const side = [new BABYLON.Vector3(-4, 2, -2),
        new BABYLON.Vector3(10, 2, -2),
        new BABYLON.Vector3(10, -2, -2),
        new BABYLON.Vector3(-12, -2, -2)
        ];
        side.push(side[0]);    //close trapezium
        const extrudePath = [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 10)];
        const rampa = BABYLON.MeshBuilder.ExtrudeShape("body", { shape: side, path: extrudePath, cap: BABYLON.Mesh.CAP_ALL }, this.scene);
        rampa.material = bodyMaterial;
        rampa.checkCollisions = true;
        rampa.collisionsEnabled = true;
        BABYLON.Tags.EnableFor(rampa);
        rampa.addTags("floor");


        const tiltedground = BABYLON.MeshBuilder/* Mesh */.CreateGround('tiltedground', { width: 10, height: 10, subdividions: 2 }, this.scene);
        tiltedground.wireframe = false;
        tiltedground.material = this.myMaterial;
        tiltedground.checkCollisions = true;
        tiltedground.position = new BABYLON.Vector3(-25,3.5,10);
        tiltedground.rotation = new BABYLON.Vector3(-Math.PI/4,0,0);
        BABYLON.Tags.EnableFor(tiltedground);
        tiltedground.addTags("floor");

        // muri perimetrali
        const muroNord = BABYLON.MeshBuilder.CreateBox("muroNord", { height: 8, width: 60, depth: 0.25 }, this.scene);
        muroNord.position = new BABYLON.Vector3(0, 2, 30);
        muroNord.material = bodyMaterial;
        muroNord.checkCollisions = true;

        const muroSud = BABYLON.MeshBuilder.CreateBox("muroSud", { height: 8, width: 60, depth: 0.25 }, this.scene);
        muroSud.position = new BABYLON.Vector3(0, 2, -30);
        muroSud.material = bodyMaterial;
        muroSud.checkCollisions = true;

        const muroEst = BABYLON.MeshBuilder.CreateBox("muroEst", { height: 8, width: 0.25, depth: 60 }, this.scene);
        muroEst.position = new BABYLON.Vector3(30, 2, 0);
        muroEst.material = bodyMaterial;
        muroEst.checkCollisions = true;

        const muroOvest = BABYLON.MeshBuilder.CreateBox("muroOvest", { height: 8, width: 0.25, depth: 60 }, this.scene);
        muroOvest.position = new BABYLON.Vector3(-30, 2, 0);
        muroOvest.material = bodyMaterial;
        muroOvest.checkCollisions = true;

        // scalino
        const scalino = BABYLON.MeshBuilder.CreateBox("scalino", { height: 0.4, width: 8, depth: 4 }, this.scene);
        scalino.position = new BABYLON.Vector3(-15, 0.2, 0);
        scalino.material = bodyMaterial;
        scalino.checkCollisions = true;
        BABYLON.Tags.EnableFor(scalino);
        scalino.addTags("floor");


        createDatGUI(this); // FIXME: Add DAT GUI after adding model

        // the canvas/window resize event handler
        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        window.addEventListener("mousemove", (evt) => {
            if (this.scene.alreadyLocked) {
                this.player.camera.playerBox.rotation.y += evt.movementX * 0.001 * (this.player.camera.angularSensibility / 250);
                var nextRotationX = this.player.camera.playerBox.rotation.x + (evt.movementY * 0.001 * (this.player.camera.angularSensibility / 250));
                if (nextRotationX < degToRad(90) && nextRotationX > degToRad(-90)) {
                    this.player.camera.playerBox.rotation.x += evt.movementY * 0.001 * (this.player.camera.angularSensibility / 250);
                }
            }
        }, false);


        // canvas = this.game.scene.getEngine().getRenderingCanvas();
        this.canvas.addEventListener("mousedown", (evt) => {
            if (this.scene && this.scene.alreadyLocked && !this.isFiring) {
                this.isFiring = true;
            }
        }, false);
        this.canvas.addEventListener("mouseup", function (evt) {
            if (this.scene && this.scene.alreadyLocked && this.isFiring) {
                this.isFiring = false;
            }
        }, false);

        this.step = 0;

        // registerBeforeRender funziona solo quando il soggetto è dentro la vista inquadrata dalla camera
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
                        this.game.state = 'PAUSE';
                    } else {
                        this.game.state = 'RUNNING';
                    }
                }


                this.keyboard.update();
                // this.keyboard.debug();

                this.player.update(this.ratio)

                this.statsFPS.update();

                if (this.game.state !== 'PAUSE') {
                    this.scene.render();
                }
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