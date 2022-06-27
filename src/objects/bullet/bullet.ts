import { ISpriteConstructor } from '../../interfaces/sprite.interface';

export class Bullet extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;
  // variables
  private currentScene: Phaser.Scene;

  constructor(aParams: ISpriteConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

    this.currentScene = aParams.scene;
    this.initSprite();
    this.currentScene.add.existing(this);
  }

  public getCurrentScene(){
    return this.currentScene;
  }
  
  protected initSprite() {
    // sprite
    this.setOrigin(0, 0);
    this.setFrame(0);
    
    // physics
    this.currentScene.physics.world.enable(this);
  }

  update(): void {
    
  }

  public destroyBullet(): void {
    this.destroy();
  }

}
