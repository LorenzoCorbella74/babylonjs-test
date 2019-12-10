import * as dat from "dat.gui";

export function createDatGUI (context) {

    let gui = new dat.GUI({ name: "My GUI" });

    let engine = gui.addFolder("Engine");
    gui.add(context, "stop");
    gui.add(context, "restart");
    engine.open();

    let camera = gui.addFolder("Camera");
    camera
        .add(context.camera, "fov", 1, 2)
        .name("FOV")
        .listen();
    camera
        .add(context.camera, "angularSensibility", 250, 750)
        .name("Angular Sensibility")
        .listen();
    camera
        .add(context.camera, "speed", 1, 2)
        .name("Speed")
        .listen();
    camera.open();



}