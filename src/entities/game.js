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

        this.scene = new BABYLON.Scene(this.engine);
        this.scene.collisionsEnabled = true;
        this.scene.gravity = new BABYLON.Vector3(0,0,0);

        this.fakeGravity = -1;
        this.isJumping = false;
        this.sprint = 0;
        this.speed = 2;

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
        BABYLON.Tags.EnableFor(ground);
        ground.addTags("floor");


        // rampa
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


        /*         const scalino = BABYLON.MeshBuilder.CreateBox("scalino", { height: 0.2, width: 4, depth: 6 }, this.scene);
                scalino.position = new BABYLON.Vector3(-15, 0.5, 0);
                scalino.material = bodyMaterial;
                scalino.checkCollisions = true;
                BABYLON.Tags.EnableFor(scalino);
                scalino.addTags("floor");
        
                const scalino2 = BABYLON.MeshBuilder.CreateBox("scalino2", { height: 0.2, width: 4, depth: 4 }, this.scene);
                scalino2.position = new BABYLON.Vector3(-15, 0.3, 1);
                scalino2.material = bodyMaterial;
                scalino2.checkCollisions = true;
                BABYLON.Tags.EnableFor(scalino2);
                scalino2.addTags("floor"); */

        const scalino3 = BABYLON.MeshBuilder.CreateBox("scalino3", { height: 0.2, width: 8, depth: 4 }, this.scene);
        scalino3.position = new BABYLON.Vector3(-15, 0.1, 0);
        scalino3.material = bodyMaterial;
        scalino3.checkCollisions = true;
        BABYLON.Tags.EnableFor(scalino3);
        scalino3.addTags("floor");


        createDatGUI(this); // FIXME: Add DAT GUI after adding model

        // the canvas/window resize event handler
        window.addEventListener('resize', () => {
            this.engine.resize();
        });



        this.step = 0;


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
        // console.log(this.dt);
    }

    startLoop () {
        this.scene.executeWhenReady(() => {

            // renders the scene 60 fps.
            this.engine.runRenderLoop(() => {

                



                this.camera.speed = this.speed + this.sprint;   // la camera si muove in base alla velocità e allo spunto

                // wj tiene conto se stiamo sul ground principale
                this.camera.onCollide = (colMesh) => {
                    let floors = this.scene.getMeshesByTags("floor");
                    for (let i = 0; i < floors.length; i++) {
                        const floor = floors[i];
                        if (colMesh.uniqueId === floor.uniqueId) {
                            this.isJumping = false;
                            this.camera.speed -= this.sprint;
                            break;
                        }
                    }
                }

                if (this.keyboard.pressed('p')) {
                    if (this.game.state === 'RUNNING') {
                        this.game.state = 'PAUSE';
                    } else {
                        this.game.state = 'RUNNING';
                    }
                }


                // finchè è maggiore di una soglia si decrementa
                if (this.fakeGravity > -1) {
                    this.fakeGravity -= 0.025;
                }

                
                // console.log(this.fakeGravity);
                this.scene.gravity.y = this.fakeGravity;

                this.keyboard.update();
                //this.keyboard.debug();

                if (this.keyboard.pressed('space')) {
                    if (this.isJumping == false) {
                        this.fakeGravity = 0.6;     // imposta un valore per la gravità positivo
                        this.isJumping = true;     // non compenetra il ground
                        this.sprint += 0.05;   // lo spazio fa aumentare lo spunto (sprint!!)
                    }
                }

                this.updateDt();
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