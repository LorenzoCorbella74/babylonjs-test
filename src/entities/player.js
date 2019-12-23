import * as BABYLON from 'babylonjs';

import { createFreeCamera, createFollowCamera } from './camera';
import { degToRad } from '../core/helpers';

export class Player {

    constructor(game) {

        this.game = game;
        this.playerBox = BABYLON.MeshBuilder.CreateBox("playerBox", { height: 2, width: 0.8, depth: 0.8 }, this.scene);
        this.playerBox.position = new BABYLON.Vector3(0, 1, -15);
        this.playerBox.ellipsoid = new BABYLON.Vector3(0.8, 2, 0.8);
        this.playerBox.movements = [false, false, false, false];

        this.jumpDesire = false;
        this.jumpHeight = 4;
        /* this.sprint = 0; */
        this.speed = 0.5;   // Mettere un default value !

        // camera
        this.camera = createFreeCamera(game.scene, game.canvas);
        this.followCamera = createFollowCamera(game.scene, this.playerBox);
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.parent = this.playerBox;
        this.camera.playerBox = this.playerBox;
        this.camera.playerBox.checkCollisions = true;
        this.camera.playerBox.applyGravity = true;

        this.game.scene.activeCamera = this.camera;

        // wj tiene conto se stiamo sul ground principale
        this.camera.playerBox.onCollide = (colMesh) => {
            let floors = this.game.scene.getMeshesByTags("floor");
            for (let i = 0; i < floors.length; i++) {
                const floor = floors[i];
                if (colMesh.uniqueId === floor.uniqueId) {
                    // console.log('Ground touched!')
                    this.jumpDesire = false;
                    // this.speed = default value ???
                    break;
                }
            }
        }
    }

    switchCamera () {
        this.game.scene.activeCamera = this.game.scene.activeCamera === this.camera ? this.followCamera : this.camera;
    }

    update (ratioFps) {

        if (this.game.keyboard.pressed('space')) {
            if (this.jumpDesire == false) {
                this.jumpDesire = true;     // non compenetra il ground
                this.camera.jumpNeed = this.camera.playerBox.position.y + this.jumpHeight;
                // this.sprint += 0.05;   // lo spazio fa aumentare lo spunto (sprint!!)
            }
        }
        // this.speed += this.sprint;   // la camera si muove in base alla velocità e allo spunto

        this.playerBox.movements = [
            this.game.keyboard.pressed('W'),
            this.game.keyboard.pressed('S'),
            this.game.keyboard.pressed('A'),
            this.game.keyboard.pressed('D')
        ];

        let relativeSpeed = this.speed / ratioFps;

        if (this.playerBox.movements[0]) {
            let forward = new BABYLON.Vector3(
                parseFloat(Math.sin(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed,
                0,
                parseFloat(Math.cos(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed
            );
            this.camera.playerBox.moveWithCollisions(forward);
        }
        if (this.playerBox.movements[1]) {
            let backward = new BABYLON.Vector3(
                parseFloat(-Math.sin(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed,
                0,
                parseFloat(-Math.cos(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed
            );
            this.camera.playerBox.moveWithCollisions(backward);
        }
        if (this.playerBox.movements[2]) {
            let left = new BABYLON.Vector3(
                parseFloat(Math.sin(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed,
                0,
                parseFloat(Math.cos(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed
            );
            this.camera.playerBox.moveWithCollisions(left);
        }
        if (this.playerBox.movements[3]) {
            let right = new BABYLON.Vector3(
                parseFloat(-Math.sin(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed,
                0,
                parseFloat(-Math.cos(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed
            );
            this.camera.playerBox.moveWithCollisions(right);
        }


        if (this.camera.jumpNeed) {
            let percentMove = this.camera.jumpNeed - this.camera.playerBox.position.y;
            let up = new BABYLON.Vector3(0,percentMove/5*  relativeSpeed,0);
            this.camera.playerBox.moveWithCollisions(up);
            // We check if the player has reached the desired height
            if(this.camera.playerBox.position.y+2> this.camera.jumpNeed){
                this.jumpDesire == false;
                this.camera.jumpNeed = false;
            }
        }

        // gravità ???
        this.camera.playerBox.moveWithCollisions(new BABYLON.Vector3(0, (-0.25) * relativeSpeed, 0));
    }

}
