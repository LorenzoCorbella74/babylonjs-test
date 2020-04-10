import * as dat from "dat.gui";
/* import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'; */

export function createDatGUI (context) {

    let gui = new dat.GUI({ name: "My GUI" });

    let engine = gui.addFolder("Engine");
    gui.add(context, "stop").name("Stop Loop");
    gui.add(context, "restart").name("Restart Loop");
    gui.add(context, "ratio", 0.5, 5).name("Game speed ratio")
    gui.add(context, "showBoundingBox").name("Bounding Boxes")
    engine.open();

    let camera = gui.addFolder("Camera");
    camera
        .add(context.player.camera, "fov", 0.6, 1.4)
        .name("FOV")
        .listen();
    camera
        .add(context.player.camera, "angularSensibility", 200, 600)
        .name("Angular Sensibility")
        .listen();
   /*  camera
        .add(context.player.camera, "inertia", 0.1, 1)
        .name("Inerzia")
        .listen(); */
    camera
        .add(context.player, "speed", 0.2, 1)
        .name("Player Speed")
        .listen();
    camera.add(context.player, "switchCamera").name("Third person");
    camera.open();

    return gui;

}