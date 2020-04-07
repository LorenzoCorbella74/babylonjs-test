import * as BABYLON from 'babylonjs';

export function createMap(game){
    
    var step = 0;

    // Light
    const lightPos = new BABYLON.Vector3(0, 5, 0);
    const light = new BABYLON.HemisphericLight('hemlight', lightPos, game.scene);
    light.intensity = 0.95;

    // Create a grid material
    // var gridMaterial = new GridMaterial("grid", game.scene);
    const myMaterial = new BABYLON.StandardMaterial("myMaterial", game.scene);
    myMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.4, 0.6);
    myMaterial.wireframe = false;

    // SPHERE
    const sphereOpts = { segments: 16, diameter: 1 }
    const powerUp = BABYLON.MeshBuilder/* Mesh */.CreateSphere('mainsphere', sphereOpts, game.scene)
    powerUp.position = new BABYLON.Vector3(16,2,4);
    const powerMat = new BABYLON.StandardMaterial("powerMat", game.scene);
    powerMat.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.7);
    powerMat.alpha = 0.5;
    powerMat.wireframe = false;
    powerUp.material = powerMat;
    powerUp.checkCollisions = true;
    powerUp.collisionsEnabled = true;
    powerUp.update = (ratio) => {
        powerUp.position.y = Math.cos(step) * 2 + 2.5;
        step += 0.05/ratio;
    };
    powerUp.onCollide = (colMesh) => {
        console.log(colMesh);
    };

    // GROUND
    const groundOpts = { width: 60, height: 60, subdividions: 2 }
    const ground = BABYLON.MeshBuilder/* Mesh */.CreateGround('mainground', groundOpts, game.scene);
    ground.wireframe = false;
    ground.material = myMaterial;
    ground.checkCollisions = true;
    BABYLON.Tags.EnableFor(ground);
    ground.addTags("floor");

    // rampa estrusa
    const bodyMaterial = new BABYLON.StandardMaterial("texture_rampa", game.scene);
    bodyMaterial.diffuseColor = new BABYLON.Color3(1.0, 0.75, 0.75);
    bodyMaterial.backFaceCulling = false;
    const side = [new BABYLON.Vector3(-4, 2, -2),
    new BABYLON.Vector3(10, 2, -2),
    new BABYLON.Vector3(10, -2, -2),
    new BABYLON.Vector3(-12, -2, -2)
    ];
    side.push(side[0]);    //close trapezium
    const extrudePath = [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 10)];
    const rampa = BABYLON.MeshBuilder.ExtrudeShape("body", { shape: side, path: extrudePath, cap: BABYLON.Mesh.CAP_ALL }, game.scene);
    rampa.material = bodyMaterial;
    rampa.checkCollisions = true;
    rampa.collisionsEnabled = true;
    BABYLON.Tags.EnableFor(rampa);
    rampa.addTags("floor");

    const tiltedground = BABYLON.MeshBuilder/* Mesh */.CreateGround('tiltedground', { width: 10, height: 10, subdividions: 2 }, game.scene);
    tiltedground.wireframe = false;
    tiltedground.material = myMaterial;
    tiltedground.checkCollisions = true;
    tiltedground.position = new BABYLON.Vector3(-25,3.5,10);
    tiltedground.rotation = new BABYLON.Vector3(-Math.PI/4,0,0);
    BABYLON.Tags.EnableFor(tiltedground);
    tiltedground.addTags("floor");

    // muri perimetrali
    const muroNord = BABYLON.MeshBuilder.CreateBox("muroNord", { height: 8, width: 60, depth: 0.25 }, game.scene);
    muroNord.position = new BABYLON.Vector3(0, 2, 30);
    muroNord.material = bodyMaterial;
    muroNord.checkCollisions = true;

    const muroSud = BABYLON.MeshBuilder.CreateBox("muroSud", { height: 8, width: 60, depth: 0.25 }, game.scene);
    muroSud.position = new BABYLON.Vector3(0, 2, -30);
    muroSud.material = bodyMaterial;
    muroSud.checkCollisions = true;

    const muroEst = BABYLON.MeshBuilder.CreateBox("muroEst", { height: 8, width: 0.25, depth: 60 }, game.scene);
    muroEst.position = new BABYLON.Vector3(30, 2, 0);
    muroEst.material = bodyMaterial;
    muroEst.checkCollisions = true;

    const muroOvest = BABYLON.MeshBuilder.CreateBox("muroOvest", { height: 8, width: 0.25, depth: 60 }, game.scene);
    muroOvest.position = new BABYLON.Vector3(-30, 2, 0);
    muroOvest.material = bodyMaterial;
    muroOvest.checkCollisions = true;

    // scalino
    const scalino = BABYLON.MeshBuilder.CreateBox("scalino", { height: 0.4, width: 8, depth: 4 }, game.scene);
    scalino.position = new BABYLON.Vector3(-15, 0.2, 0);
    scalino.material = bodyMaterial;
    scalino.checkCollisions = true;
    BABYLON.Tags.EnableFor(scalino);
    scalino.addTags("floor");

    return powerUp;
}