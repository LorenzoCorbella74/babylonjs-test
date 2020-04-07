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
import { Controls } from './core/controls';
import { Player } from './entities/player';

import { createMap } from './maps/dm1';

export default class Game {

    constructor(canvas) {
        this.canvas = canvas
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.dt = this.engine.getDeltaTime();

        this.ratio = 1; // TODO: indica il rapporto con cui l'engine renderizza

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
        this.controls = new Controls(this);
        this.controls.controlOnPointerDown();


        this.powerUp = createMap(this); // da spostare dentro una sua classe!!!!!


        this.gui = createDatGUI(this); // FIXME: Add DAT GUI after adding model

        // the canvas/window resize event handler
        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        // NOTES: registerBeforeRender funziona solo quando il soggetto è dentro la vista inquadrata dalla camera
        this.scene.registerBeforeRender(() => {

        });

        return this;
    }

    updateDt () {
        this.dt = this.engine.getDeltaTime();   // questo è inutile in quanto può sempre essere recuperato con l'engine...
        // this.ratio = Math.round(1000 / this.engine.getDeltaTime()) / 60;
        // se s.engine.getDeltaTime() restituisce 32 (cioè il doppio di quello che dovrebbe essere per avere 60FPS)
        // allora il ratio sarà < 1 ed andrà ad aumentare la velocità per compensare il fatto che il frame è stato più lento
        // console.log(this.dt, this.ratio);
    }

    startLoop () {
        this.scene.executeWhenReady(() => {

            // renders the scene 60 fps.
            this.engine.runRenderLoop(() => {

                this.updateDt();

                if (this.controls.pressed('p')) {
                    if (this.game.state === 'RUNNING') {
                        this.game.state = 'PAUSED';
                    } else {
                        this.game.state = 'RUNNING';
                    }
                }

                this.controls.update();
                // this.controls.debug();

                this.player.update(this.ratio);
                this.powerUp.update(this.ratio);


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