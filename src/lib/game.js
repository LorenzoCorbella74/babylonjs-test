// Tutto in una volta
import { Engine, UniversalCamera, HemisphericLight, MeshBuilder, Scene, Vector3, Color3, StandardMaterial } from 'babylonjs';

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
        this.camera = this.createCamera(this.scene, this.canvas);

        // Light
        const lightPos = new Vector3(0, 5, 0)
        this.light = new HemisphericLight('hemlight', lightPos, this.scene)
        this.light.intensity = 0.95;

        // Create a grid material
        // var gridMaterial = new GridMaterial("grid", this.scene);
        this.myMaterial = new StandardMaterial("myMaterial", this.scene);
        this.myMaterial.diffuseColor = new Color3(0.3, 0.4, 0.6);
        this.myMaterial.wireframe = false;

        // powerUp
        const sphereOpts = { segments: 16, diameter: 2 }
        this.powerUp = MeshBuilder/* Mesh */.CreateSphere('mainsphere', sphereOpts, this.scene)
        this.powerUp.position.y = 1;
        const powerMat = new StandardMaterial("powerMat", this.scene);
        powerMat.diffuseColor = new Color3(0.7, 0.7, 0.7);
        powerMat.alpha = 0.5;
        powerMat.wireframe = false;
        this.powerUp.material = powerMat;
        this.powerUp.checkCollisions = true;
        this.powerUp.collisionsEnabled = true;

        // GROUND
        const groundOpts = { width: 60, height: 60, subdividions: 2 }
        const ground = MeshBuilder/* Mesh */.CreateGround('mainground', groundOpts, this.scene);
        ground.wireframe = false;
        ground.material = this.myMaterial;
        ground.checkCollisions = true;

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

        this.step = 0;
        this.scene.registerBeforeRender(() => {

            this.powerUp.position.y = Math.cos(this.step) * 2 + 2
            this.step += 0.075;

            //update stats
            this.statsFPS.update();
            // this.statsMemory.update();

        });

        return this;
    }

    createCamera (scene, canvas) {
        const cameraPos = new Vector3(0, 7.5, -15);
        let camera = new UniversalCamera('maincam', cameraPos, scene);
        camera.setTarget(Vector3.Zero());
        camera.attachControl(canvas, false);

        // See more JavaScript KeyCodes here: https://keycode.info/
        camera.keysUp.push(87);    // 87 corresponds to 'w'
        camera.keysDown.push(83);  // 83 corresponds to 's'
        camera.keysLeft.push(65);  // 65 corresponds to 'a'
        camera.keysRight.push(68); // 68 corresponds to 'd'
        camera.speed = 1;
        camera.fov = 0.9;
        camera.inertia = 0;
        // create an ellipsoid around the camera (this will collide with other objects, such as the `sphere`. This makes it so we can't walk inside of the sphere)
        camera.ellipsoid = new Vector3(1, 1.8, 1);
        camera.checkCollisions = true;
        // camera.applyGravity = true;
        camera.collisionsEnabled = true;

        return camera;
    }

    createStats () {
        //fps stats
        this.statsFPS = new Stats();
        this.statsFPS.domElement.style.cssText = "position:absolute;top:3px;left:3px;";
        this.statsFPS.showPanel(0); // 0: fps,
        //add stats for FPS and Memory usage
        document.body.appendChild(this.statsFPS.dom);
    }

    createDatGUI () {
        this.gui = new dat.GUI({ name: "My GUI" });
        let engine = this.gui.addFolder("Engine");
        engine.add(this.myMaterial, "wireframe").listen();
        this.gui.add(this, "stop");
        this.gui.add(this, "restart");
        engine.open();
    }

    animate () {
        this.scene.executeWhenReady(() => {
            this.engine.runRenderLoop(() => {
                this.scene.render();
            })
            return this;
        });
    }

    stop () {
        this.engine.stopRenderLoop();
    }

    restart () {
        this.animate();
    }
}