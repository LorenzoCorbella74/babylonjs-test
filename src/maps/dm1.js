import * as BABYLON from 'babylonjs';

export function createMap(game){

    // Light
    const lightPos = new BABYLON.Vector3(0, 5, 0);
    const light = new BABYLON.HemisphericLight('hemlight', lightPos, game.scene);
    light.intensity = 0.95;

    // Create a grid material
    // var gridMaterial = new GridMaterial("grid", game.scene);
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", game.scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.25, 0.4, 0.6);

    // GROUND
    const groundOpts = { width: 60, height: 60, subdividions: 2 }
    const ground = BABYLON.MeshBuilder/* Mesh */.CreateGround('mainground', groundOpts, game.scene);
    ground.wireframe = false;
    ground.material = groundMaterial;
    ground.checkCollisions = true;
    BABYLON.Tags.EnableFor(ground);
    ground.addTags("floor");
    ground.showBoundingBox = game.showBoundingBox;

    const wallMaterial = new BABYLON.StandardMaterial("texture_rampa", game.scene);
    wallMaterial.diffuseColor = new BABYLON.Color3(0.75, 0.75, 0.75);
    wallMaterial.backFaceCulling = false;

    /* ------------------------ rampa estrusa ------------------------ */
    /* const side = [new BABYLON.Vector3(-4, 2, -2),
    new BABYLON.Vector3(10, 2, -2),
    new BABYLON.Vector3(10, -2, -2),
    new BABYLON.Vector3(-12, -2, -2)
    ];
    side.push(side[0]);    //close trapezium
    const extrudePath = [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 10)];
    const rampa = BABYLON.MeshBuilder.ExtrudeShape("body", { shape: side, path: extrudePath, cap: BABYLON.Mesh.CAP_ALL }, game.scene);
    rampa.material = wallMaterial;
    rampa.checkCollisions = true;
    rampa.collisionsEnabled = true;
    BABYLON.Tags.EnableFor(rampa);
    rampa.addTags("floor");
    rampa.showBoundingBox = true */
    /* ------------------------ rampa estrusa ------------------------ */

    const tiltedground = BABYLON.MeshBuilder/* Mesh */.CreateGround('tiltedground', { width: 10, height: 10, subdividions: 2 }, game.scene);
    tiltedground.wireframe = false;
    tiltedground.material = groundMaterial;
    tiltedground.checkCollisions = true;
    tiltedground.position = new BABYLON.Vector3(-25,3.5,10);
    tiltedground.rotation = new BABYLON.Vector3(-Math.PI/4,0,0);
    BABYLON.Tags.EnableFor(tiltedground);
    tiltedground.addTags("floor");
    tiltedground.showBoundingBox = true

    // muri perimetrali
    const muroNord = BABYLON.MeshBuilder.CreateBox("muroNord", { height: 8, width: 60, depth: 0.25 }, game.scene);
    muroNord.position = new BABYLON.Vector3(0, 4, 30);
    muroNord.material = wallMaterial;
    muroNord.checkCollisions = true;
    muroNord.showBoundingBox = true

    const muroSud = BABYLON.MeshBuilder.CreateBox("muroSud", { height: 8, width: 60, depth: 0.25 }, game.scene);
    muroSud.position = new BABYLON.Vector3(0, 4, -30);
    muroSud.material = wallMaterial;
    muroSud.checkCollisions = true;
    muroSud.showBoundingBox = true

    const muroEst = BABYLON.MeshBuilder.CreateBox("muroEst", { height: 8, width: 0.25, depth: 60 }, game.scene);
    muroEst.position = new BABYLON.Vector3(30, 4, 0);
    muroEst.material = wallMaterial;
    muroEst.checkCollisions = true;
    muroEst.showBoundingBox = true

    const muroOvest = BABYLON.MeshBuilder.CreateBox("muroOvest", { height: 8, width: 0.25, depth: 60 }, game.scene);
    muroOvest.position = new BABYLON.Vector3(-30, 4, 0);
    muroOvest.material = wallMaterial;
    muroOvest.checkCollisions = true;
    muroOvest.showBoundingBox = true

    // scalino
    const scalino = BABYLON.MeshBuilder.CreateBox("scalino", { height: 0.4, width: 8, depth: 4 }, game.scene);
    scalino.position = new BABYLON.Vector3(-15, 0.2, 0);
    scalino.material = wallMaterial;
    scalino.checkCollisions = true;
    BABYLON.Tags.EnableFor(scalino);
    scalino.addTags("floor");
    scalino.showBoundingBox = true
}