import * as BABYLON from 'babylonjs';
import GameObject from './gameObject';

export default class PowerUp extends GameObject {

  constructor(game) {

    super('powerup', game);

    this.step = 0;

    const sphereOpts = { segments: 16, diameter: 1.25 }
    const vertexData = BABYLON.VertexData.CreateSphere(sphereOpts)
    // const vertexData = BABYLON.VertexData.CreateBox({ size:1 });
    vertexData.applyToMesh(this);
    this.showBoundingBox = true;
    this.position = new BABYLON.Vector3(5, 0, 0);

    const material = new BABYLON.StandardMaterial('cubeMaterial', game.scene);
    material.emissiveColor = new BABYLON.Color3(0.7, 0, 0.5);
    material.specularColor = new BABYLON.Color3(0, 1, 0);
    material.diffuseColor = new BABYLON.Color3(0.5, 0.75, 1);
    // material.alpha = 0.5;
    material.wireframe = false;
    this.material = material;

    this.checkCollisions = true;
    this.collisionsEnabled = true;

    this.actionManager = new BABYLON.ActionManager(game.scene);
    this.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        {
          trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
          parameter: game.player
        },
        (event) => {
          console.log("Touching: ", event.additionalData.id);
          // create particles
          this.setEnabled(false)
          setTimeout(() => {
            this.restart()
          }, 10000)
        }
        /* 
            Vedere come specificare una condition function 
            Source: https://doc.babylonjs.com/how_to/how_to_use_actions
        */
      )
    );

    /* 
      Example of BABYLON animation: al momento non è possibile rendere l'animazione con il "ratio dinamico"
      const animation = new BABYLON.Animation('animCube', 'rotation.y', 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

      const keys = [
        { frame: 0, value: 0 },
        { frame: 30, value: Math.PI / 2 },
        { frame: 60, value: Math.PI },
        { frame: 90, value: 3 * Math.PI / 2 },
        { frame: 120, value: 2 * Math.PI }
      ];
      animation.setKeys(keys);
      this.animations.push(animation);
      this.scene.beginAnimation(this, 0, 120, true, 1.0); 
    */
  }

  restart() {
    this.setEnabled(true)
    this.material.alpha = 0;
  }

  update(ratio) {
    if (this.material.alpha < 1) {
      this.material.alpha += 0.025 / ratio;
    }
    this.position.y = Math.cos(this.step) * 0.5 + 1.5;
    this.rotation.y = Math.sin(this.step) * 0.5
    this.step += 0.08 / ratio;
  }

}