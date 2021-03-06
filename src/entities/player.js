import * as BABYLON from 'babylonjs';

import { WeaponsInventory } from './weapons';
import { createFreeCamera, createFollowCamera, animateCameraPosAndRot } from './camera';
import { degToRad } from '../core/helpers';
import GameObject from './gameObject.js';

export default class Player extends GameObject {

    constructor(game) {

        super('player', game);

        const playerBox = BABYLON.VertexData.CreateBox("playerBox", { height: 2, width: 0.8, depth: 0.8 }, this.scene);
        playerBox.applyToMesh(this);

        this.enableEdgesRendering(); // https://doc.babylonjs.com/how_to/how_to_use_edgesrenderer
        this.edgesWidth = 4.0;
        this.edgesColor = new BABYLON.Color4(0.1, 1, 0.2);
        // this.disableEdgesRendering(); per disabilitare gli spigoli

        const playerMat = new BABYLON.StandardMaterial("playerMat", game.scene);
        playerMat.diffuseColor = new BABYLON.Color3(0.1, 1, 0.2);
        playerMat.alpha = 0.65;
        this.material = playerMat;

        this.position = new BABYLON.Vector3(0, 1, -10);
        this.ellipsoid = new BABYLON.Vector3(0.8, 2, 0.8);
        this.movements = [false, false, false, false];

        this.jumpDesire = false;
        this.jumpHeight = 5;
        /* this.sprint = 0; */
        this.speed = 0.2;   // Mettere un default value !

        // camera
        this.camera = createFreeCamera(game.scene, game.canvas);
        this.followCamera = createFollowCamera(game.scene, this);
        this.camera.setTarget(BABYLON.Vector3.Zero());  // decidere dove far guardare all'inizio...
        this.camera.parent = this;
        this.camera.playerBox = this;
        this.camera.playerBox.checkCollisions = true;
        this.camera.playerBox.applyGravity = true;

        this.game.scene.activeCamera = this.camera;
        this.isThirdPersonCamera = false;

        this.weaponsInventory = new WeaponsInventory(this);
        this.currentWeapon = this.weaponsInventory.selectedWeapon;		// arma corrente
        this.weaponsInventory.initWeapon(this)

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

        this.metadata = {
            hp: 100,
            ap: 0,
            get alive() {
                return this.metadata.hp > 0
            },
            setDamage(num) {
                if (this.metadata.ap > 0) {
                    this.metadata.ap -= num;
                }
                if (this.metadata.ap < 0) {
                    this.metadata.hp += this.metadata.ap
                }
                this.metadata.hp -= num
            }
        };

    }

    switchCamera() {
        // nel caso siano telecamere diverse si può switchare così
        // this.game.scene.activeCamera = this.game.scene.activeCamera === this.camera ? this.followCamera : this.camera;
        let current = this.camera.position.clone();
        if (!this.isThirdPersonCamera) {
            animateCameraPosAndRot(
                this.game.scene.activeCamera,
                current,
                new BABYLON.Vector3(current.x, current.y + 5, current.z - 15),
                this.camera.position,
                this.camera.position,
                this.game.scene
            );
        } else {
            animateCameraPosAndRot(
                this.game.scene.activeCamera,
                current,
                new BABYLON.Vector3(current.x, current.y - 5, current.z + 15),
                this.camera.position,
                this.camera.position,
                this.game.scene
            );
        }
        this.isThirdPersonCamera = !this.isThirdPersonCamera;

    }


    hotKey(keyCode) {
        if (keyCode == 48) {
            keyCode = 58
        }
        if (keyCode - 49 in this.weaponsInventory.weapons) {
            this.weaponsInventory.weapon = keyCode - 49;
            // se disponibile si sceglie
            if (this.weaponsInventory.weapons[this.weaponsInventory.weapon].available) {
                this.weaponsInventory.selectedWeapon = this.weaponsInventory.weapons[this.weaponsInventory.weapon];
                this.currentWeapon = this.weaponsInventory.selectedWeapon;		// arma corrente
            }
        }
    }

    wheel(delta) {
        if (delta > 0) {
            if (this.weaponsInventory.weapon <= 0) {
                this.weaponsInventory.weapon = this.weaponsInventory.weapons.length - 1
            } else {
                this.weaponsInventory.weapon--;
            }
        } else {
            if (this.weaponsInventory.weapon >= this.weaponsInventory.weapons.length - 1) {
                this.weaponsInventory.weapon = 0
            } else {
                this.weaponsInventory.weapon++;
            }
        }
        // se disponibile si sceglie
        if (this.weaponsInventory.weapons[this.weaponsInventory.weapon].available) {
            this.weaponsInventory.selectedWeapon = this.weaponsInventory.weapons[this.weaponsInventory.weapon];
            this.currentWeapon = this.weaponsInventory.selectedWeapon;		// arma corrente
        }
    }

    update(ratioFps) {

        if (this.game.controls.up('F')) {
            setTimeout(() => {
                this.switchCamera();
            }, 100);
        }

        if (this.game.controls.pressed('space')) {
            if (this.jumpDesire == false) {
                this.jumpDesire = true;     // non compenetra il ground
                this.camera.jumpNeed = this.camera.playerBox.position.y + this.jumpHeight;
                // this.sprint += 0.05;   // lo spazio fa aumentare lo spunto (sprint!!)
            }
        }
        // this.speed += this.sprint;   // la camera si muove in base alla velocità e allo spunto

        this.movements = [
            this.game.controls.pressed('W'),
            this.game.controls.pressed('S'),
            this.game.controls.pressed('A'),
            this.game.controls.pressed('D')
        ];

        let relativeSpeed = this.speed / ratioFps;

        if (this.movements[0]) {
            let forward = new BABYLON.Vector3(
                parseFloat(Math.sin(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed,
                0,
                parseFloat(Math.cos(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed
            );
            this.camera.playerBox.moveWithCollisions(forward);
        }
        if (this.movements[1]) {
            let backward = new BABYLON.Vector3(
                parseFloat(-Math.sin(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed,
                0,
                parseFloat(-Math.cos(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed
            );
            this.camera.playerBox.moveWithCollisions(backward);
        }
        if (this.movements[2]) {
            let left = new BABYLON.Vector3(
                parseFloat(Math.sin(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed,
                0,
                parseFloat(Math.cos(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed
            );
            this.camera.playerBox.moveWithCollisions(left);
        }
        if (this.movements[3]) {
            let right = new BABYLON.Vector3(
                parseFloat(-Math.sin(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed,
                0,
                parseFloat(-Math.cos(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed
            );
            this.camera.playerBox.moveWithCollisions(right);
        }


        if (this.camera.jumpNeed) {
            let percentMove = this.camera.jumpNeed - this.camera.playerBox.position.y;
            let up = new BABYLON.Vector3(0, percentMove / 3 * relativeSpeed, 0);
            this.camera.playerBox.moveWithCollisions(up);
            // We check if the player has reached the desired height
            if (this.camera.playerBox.position.y + 2 > this.camera.jumpNeed) {
                this.jumpDesire == false;
                this.camera.jumpNeed = false;
            }
        }

        // gravità ???
        this.camera.playerBox.moveWithCollisions(new BABYLON.Vector3(0, (-0.5) * relativeSpeed, 0));

        // FIRE
        if (this.game.scene.alreadyLocked && this.game.controls.mouseLeft) {
            console.log('mouse left!');
            this.weaponsInventory.fire()
        }
        if (this.game.scene.alreadyLocked && this.game.controls.mouseRight) {
            console.log('mouse right!');
        }
    }
}
