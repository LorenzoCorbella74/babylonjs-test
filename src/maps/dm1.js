import * as BABYLON from 'babylonjs';

export function createMap(game) {

    // Light
    const lightPos = new BABYLON.Vector3(0, 5, 0);
    const light = new BABYLON.HemisphericLight('hemlight', lightPos, game.scene);
    light.intensity = 0.95;
    
    // Create a grid material
    // var gridMaterial = new GridMaterial("grid", game.scene);
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", game.scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture(`${game.images['tile1']}`, game.scene);
    groundMaterial.diffuseTexture.uScale = 10;
    groundMaterial.diffuseTexture.vScale = 5;
    // groundMaterial.diffuseColor = new BABYLON.Color3(0.25, 0.4, 0.6);

    // GROUND
    const groundOpts = { width: 60, height: 30, subdividions: 2 }
    const ground1 = BABYLON.MeshBuilder/* Mesh */.CreateGround('mainground', groundOpts, game.scene);
    ground1.wireframe = false;
    ground1.material = groundMaterial;
    ground1.checkCollisions = true;
    BABYLON.Tags.EnableFor(ground1);
    ground1.addTags("floor");
    ground1.showBoundingBox = game.showBoundingBox;

    const ground2 = BABYLON.MeshBuilder/* Mesh */.CreateGround('mainground', groundOpts, game.scene);
    ground2.wireframe = false;
    ground2.position.z = 30;
    ground2.position.y = -2;
    ground2.material = groundMaterial;
    ground2.checkCollisions = true;
    BABYLON.Tags.EnableFor(ground2);
    ground2.addTags("floor");
    ground2.showBoundingBox = game.showBoundingBox; 

    const wallMaterial = new BABYLON.StandardMaterial("texture_rampa", game.scene); 
    wallMaterial.diffuseTexture = new BABYLON.Texture(`${game.images['wall']}`, game.scene);
    wallMaterial.diffuseTexture.uScale = 2;
    wallMaterial.diffuseTexture.vScale = 10;
    // wallMaterial.diffuseColor = new BABYLON.Color3(0.75, 0.75, 0.75);
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
    tiltedground.position = new BABYLON.Vector3(-25, -2, 19.75);
    tiltedground.rotation = new BABYLON.Vector3(Math.PI / 8, 0, 0);
    BABYLON.Tags.EnableFor(tiltedground);
    tiltedground.addTags("floor");
    tiltedground.showBoundingBox = true

    // muri perimetrali
    const muroNord = BABYLON.MeshBuilder.CreateBox("muroNord", { height: 12, width: 60, depth: 0.25 }, game.scene);
    muroNord.position = new BABYLON.Vector3(0, 4, 45);
    muroNord.material = wallMaterial;
    muroNord.checkCollisions = true;
    muroNord.showBoundingBox = true

    const muroSud = BABYLON.MeshBuilder.CreateBox("muroSud", { height: 12, width: 60, depth: 0.25 }, game.scene);
    muroSud.position = new BABYLON.Vector3(0, 4, -15);
    muroSud.material = wallMaterial;
    muroSud.checkCollisions = true;
    muroSud.showBoundingBox = true

    const muroEst = BABYLON.MeshBuilder.CreateBox("muroEst", { height: 12, width: 0.25, depth: 60 }, game.scene);
    muroEst.position = new BABYLON.Vector3(30, 4, 15);
    muroEst.material = wallMaterial;
    muroEst.checkCollisions = true;
    muroEst.showBoundingBox = true

    const muroOvest = BABYLON.MeshBuilder.CreateBox("muroOvest", { height: 12, width: 0.25, depth: 60 }, game.scene);
    muroOvest.position = new BABYLON.Vector3(-30, 4, 15);
    muroOvest.material = wallMaterial;
    muroOvest.checkCollisions = true;
    muroOvest.showBoundingBox = true

    // scalino
    const scalinoMaterial = new BABYLON.StandardMaterial("texture_SCALINO", game.scene);
    scalinoMaterial.diffuseColor = new BABYLON.Color3(0, 0.75, 0.75);
    const scalino = BABYLON.MeshBuilder.CreateBox("scalino", { height: 0.6, width: 8, depth: 4 }, game.scene);
    scalino.position = new BABYLON.Vector3(-15, 0.2, 0);
    scalino.material = scalinoMaterial;
    scalino.checkCollisions = true;
    BABYLON.Tags.EnableFor(scalino);
    scalino.addTags("floor");
    scalino.showBoundingBox = true
}