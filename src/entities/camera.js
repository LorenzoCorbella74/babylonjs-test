import * as BABYLON from "babylonjs";

export function createFreeCamera (scene, canvas) {

    const cameraPos = new BABYLON.Vector3(0, 0, -0.1);
    let camera = new BABYLON./* UniversalCamera */FreeCamera('maincam', cameraPos, scene);
    // camera.setTarget(BABYLON.Vector3.Zero());
    // camera.attachControl(canvas, false);  // TODO: true o false ???

    // See KeyCodes here: https://keycode.info/
    // camera.keysUp.push(87);    // 87 corresponds to 'w'
    // camera.keysDown.push(83);  // 83 corresponds to 's'
    // camera.keysLeft.push(65);  // 65 corresponds to 'a'
    // camera.keysRight.push(68); // 68 corresponds to 'd'

    camera.inertia = 0.2;
    camera.fov = 0.8;
    // camera.minZ = 1.81;
    camera.angularSensibility = 250;
    // camera.speed = 2; // è il player che si muove e la camera che viene dietro....


    // create an ellipsoid around the camera (this will collide with other objects)
    // camera.ellipsoid = new BABYLON.Vector3(1.2, 2, 1.2);
    // camera.checkCollisions = true;
    // camera.applyGravity = true;
    // camera.collisionsEnabled = true;
    //camera._needMoveForGravity = true;

    return camera;
}


export function createFollowCamera (scene, target) {
    var camera = new BABYLON.FollowCamera("tankFollowCamera", target.position, scene, target);
    camera.radius = 18;             // how far from the object to follow
    camera.heightOffset = 9;        // how high above the object to place the camera
    camera.rotationOffset = 180;    // the viewing angle
    camera.cameraAcceleration = .1; // how fast to move
    camera.maxCameraSpeed = 2;      // speed limit
    return camera;
}

export function animateCameraPosAndRot (
    c/* : BABYLON.Camera */,
    fromPos/* : BABYLON.Vector3 */,
    toPos/* : BABYLON.Vector3 */,
    fromTgt/* : BABYLON.Vector3 */,
    toTgt/* : BABYLON.Vector3 */,
    scene/* : BABYLON.Scene */
) {
    console.log("animation Camera");
    var animCamPosition = new BABYLON.Animation(
        "animCam",
        "position",
        60,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    var keysPosition = [];
    keysPosition.push({ frame: 0, value: fromPos});
    keysPosition.push({ frame: 150, value: toPos});
    animCamPosition.setKeys(keysPosition);

    var animCamTgt = new BABYLON.Animation("animTgt", "target", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    var keysTgt = [];
    keysTgt.push({ frame: 0, value: fromTgt});
    keysTgt.push({ frame: 150, value: toTgt });
    animCamTgt.setKeys(keysTgt);

    // ease animation
    let easingFunction = new BABYLON.CircleEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    animCamPosition.setEasingFunction(easingFunction);
    animCamTgt.setEasingFunction(easingFunction);

    c.animations.push(animCamPosition);
    c.animations.push(animCamTgt);
    scene.beginAnimation(c, 0, 150, false, 1, () => {
        console.log("finished animation Camera");
        /* console.log(this.mainCamera.position);
        console.log(this.mainCamera.target); */
    });
}
