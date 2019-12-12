import * as BABYLON from "babylonjs";

export function createCamera (scene, canvas) {

    const cameraPos = new BABYLON.Vector3(0, 7.5, -15);
    let camera = new BABYLON./* UniversalCamera */FreeCamera('maincam', cameraPos, scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false);  // TODO: true o false ???

    // See KeyCodes here: https://keycode.info/
    camera.keysUp.push(87);    // 87 corresponds to 'w'
    camera.keysDown.push(83);  // 83 corresponds to 's'
    camera.keysLeft.push(65);  // 65 corresponds to 'a'
    camera.keysRight.push(68); // 68 corresponds to 'd'

    camera.inertia = 0.2;
    camera.fov = 1.5;
    camera.minZ = 0;
    camera.angularSensibility = 500;
    camera.speed = 2;

    // create an ellipsoid around the camera (this will collide with other objects)
    camera.ellipsoid = new BABYLON.Vector3(1, 1.8, 1);
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera.collisionsEnabled = true;
    camera._needMoveForGravity = true;

    return camera;
}
