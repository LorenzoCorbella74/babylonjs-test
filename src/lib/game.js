// Tutto in una volta
import { Engine, FreeCamera, HemisphericLight, MeshBuilder, Scene, Vector3, Color3, StandardMaterial } from 'babylonjs';

// a pezzi
/* import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { GridMaterial } from "@babylonjs/materials/grid";

import "@babylonjs/core/Meshes/meshBuilder"; */

import Stats from "stats-js";
import * as dat from "dat.gui";

export default class Game {

    constructor(canvas) {
        this.canvas = canvas
        this.engine = new Engine(this.canvas, true)

        this.scene = null
        this.camera = null
        this.light = null

        this.state = {
            options: {
                // TBD
            },
            current: 'test'
        };
    }

    createScene () {
        this.scene = new Scene(this.engine)

        this.createStats();

        // camera
        const cameraPos = new Vector3(0, 5, -10)
        this.camera = new FreeCamera('maincam', cameraPos, this.scene)
        this.camera.setTarget(Vector3.Zero())
        this.camera.attachControl(this.canvas, false)

        // Light
        const lightPos = new Vector3(0, 1, 0)
        this.light = new HemisphericLight('hemlight', lightPos, this.scene)

        // Create a grid material
        // var gridMaterial = new GridMaterial("grid", this.scene);
        this.myMaterial = new StandardMaterial("myMaterial", this.scene);
        this.myMaterial.diffuseColor = new Color3(0.3, 0.4, 0.6);
        this.myMaterial.wireframe = false;

        // ACTOR
        const sphereOpts = { segments: 16, diameter: 2 }
        this.actor = MeshBuilder/* Mesh */.CreateSphere('mainsphere', sphereOpts, this.scene)
        this.actor.position.y = 1;
        this.actor.material = this.myMaterial;

        // GROUND
        const groundOpts = { width: 6, height: 6, subdividions: 2 }
        const ground = MeshBuilder/* Mesh */.CreateGround('mainground', groundOpts, this.scene);
        ground.wireframe = false;
        ground.material = this.myMaterial;

        this.createDatGUI(); // FIXME: Add DAT GUI after adding model

        // the canvas/window resize event handler
        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        // KEYBOARD INPUTS
        /* this.scene.onKeyboardObservable.add((info) => {
            console.log(info)
            // if(info.type === BABYLON.PointerEventTypes.POINTERWHEEL) {
            //   moveBall()
            // }
        }) */

        return this;
    }

    createStats () {
        //fps stats
        this.statsFPS = new Stats();
        this.statsFPS.domElement.style.cssText = "position:absolute;top:3px;left:3px;";
        this.statsFPS.showPanel(0); // 0: fps,
        //memory stats
        // this.statsMemory = new Stats();
        // this.statsMemory.showPanel(2); //2: mb, 1: ms, 3+: custom
        // this.statsMemory.domElement.style.cssText = "position:absolute;top:3px;left:84px;";
        //add stats for FPS and Memory usage
        document.body.appendChild(this.statsFPS.dom);
        // document.body.appendChild(this.statsMemory.dom);
    }

    createDatGUI () {
        this.gui = new dat.GUI({ name: "My GUI" });
        let fields = this.gui.addFolder("Field");
        fields.add(this.myMaterial, "wireframe").listen();
        fields.open();
    }

    animate () {
        this.engine.runRenderLoop(() => {

            this.scene.render();

            //update stats
            this.statsFPS.update();
            // this.statsMemory.update();
        })
        return this;
    }
}