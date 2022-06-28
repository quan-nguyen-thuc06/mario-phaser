import { ISpriteConstructor } from '../interfaces/sprite.interface';

export class FireFly extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;

  // variables
  private currentScene: Phaser.Scene;

  constructor(aParams: ISpriteConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

    // variables
    this.currentScene = aParams.scene;
    this.initSprite();
    this.initTween();
    this.currentScene.add.existing(this);
  }

  private initSprite() {
    // sprite
    this.setOrigin(0, 0);
    this.setFrame(0);

    // physics
    this.currentScene.physics.world.enable(this);
    this.body.setSize(8, 8);
    this.body.setAllowGravity(false);

    // play animation (animation with the same name as texture)
    this.anims.play('fire');
  }

  private initTween(): void {
    this.currentScene.add.tween({
        targets: this,
        props: { y: this.y - 150},
        duration: 1000,
        ease: 'Power0',
        yoyo: true,
        repeat: -1
      });
  }
  
  update(): void {}

}
