import * as BABYLON from 'babylonjs';

export default class PowerUp {

  constructor(game) {
    this.game = game
    this.list = []
  }

  create () {
    const sphereOpts = { segments: 16, diameter: 1.25 }
    const theOne = BABYLON.MeshBuilder.CreateSphere("sphere", sphereOpts, this.game.scene);
    theOne.position = new BABYLON.Vector3(5, 0, 0);
    theOne.rotation = new BABYLON.Vector3(0, 0, 0);
    theOne.showBoundingBox = true;

    const material = new BABYLON.StandardMaterial('sphere_material', this.game.scene);
    material.emissiveColor = new BABYLON.Color3(0.7, 0, 0.5);
    material.specularColor = new BABYLON.Color3(0, 1, 0);
    material.diffuseColor = new BABYLON.Color3(0.5, 0.75, 1);
    material.wireframe = false;

    theOne.particleSystem = new BABYLON.ParticleSystem("particles", 2000);
    theOne.particleSystem.particleTexture = new BABYLON.Texture(`${this.game.images.png['flare']}`);
    // Position where the particles are emitted from
    theOne.particleSystem.emitter = theOne;
    theOne.particleSystem.start();

    theOne.material = material;

    theOne.checkCollisions = true;
    theOne.collisionsEnabled = true;
    BABYLON.Tags.AddTagsTo(theOne, "powerup");

    theOne.actionManager = new BABYLON.ActionManager(this.game.scene);
    theOne.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        {
          trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
          parameter: this.game.player
        },
        (event) => {
          console.log("Touching: ", event.additionalData.id);
          // create particles
          theOne.setEnabled(false)
          theOne.metadata.visible = false;
          // theOne.particleSystem.stop();
          setTimeout(() => {
            this.restart(theOne)
          }, 10000) // TODO: costante?
        }
        /* 
        Vedere come specificare una condition function 
        Source: https://doc.babylonjs.com/how_to/how_to_use_actions
        */
      )
    );

    // metadata
    theOne.metadata = {};
    theOne.metadata.animationStep = 0;
    theOne.metadata.visible = true;

    this.list.push(theOne);
  }

  restart (entity) {
    entity.setEnabled(true)
    entity.material.alpha = 0;
    entity.metadata.visible = true;
    setTimeout(() => {
      entity.particleSystem.start();
    }, 1000) // TODO: costante?
  }

  update (ratio) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      var powerup = this.list[i];

      if (powerup.material.alpha < 1) {
        powerup.material.alpha += 0.0125 / ratio; // TODO: costante?
      } 
      powerup.position.y = Math.cos(powerup.metadata.animationStep) * 0.5 + 1.5;
      powerup.rotation.y = Math.sin(powerup.metadata.animationStep) * 0.5
      powerup.metadata.animationStep += 0.08 / ratio;

    }
  }

}