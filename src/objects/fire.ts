import { ISpriteConstructor } from '../interfaces/sprite.interface';

export class Fire extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;
  // variables
  private currentScene: Phaser.Scene;

  constructor(aParams: ISpriteConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

    this.currentScene = aParams.scene;
    this.initSprite();
    this.currentScene.add.existing(this);
  }

  private initSprite() {
    // sprite
    this.setOrigin(0, 0);
    this.setFrame(0);
    
    // physics
    this.currentScene.physics.world.enable(this);
    this.body.setSize(8, 8);
    // this.body.setCircle(4);
    this.body.setBounce(1,1);
  }

  update(): void {
    this.anims.play('fire', true);
    if (
      !Phaser.Geom.Intersects.RectangleToRectangle(
        this.getBounds(),
        this.currentScene.cameras.main.worldView
      )||this.body.blocked.right||this.body.blocked.left
    ) {
      this.destroy();
    }
  }

  public destroyFire(): void {
    this.destroy();
  }

}
