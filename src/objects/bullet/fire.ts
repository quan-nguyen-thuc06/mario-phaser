import { ISpriteConstructor } from '../../interfaces/sprite.interface';
import { Bullet } from './bullet';

export class Fire extends Bullet {

  constructor(aParams: ISpriteConstructor) {
    super(aParams);
  }

  protected initSprite() {
    super.initSprite();
    this.body.setSize(8, 8);
    this.body.setBounce(1,1);
  }

  update(): void {
    this.anims.play('fire', true);
    if (
      !Phaser.Geom.Intersects.RectangleToRectangle(
        this.getBounds(),
        this.getCurrentScene().cameras.main.worldView
      )||this.body.blocked.right||this.body.blocked.left
    ) {
      this.destroy();
    }
  }

}
