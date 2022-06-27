import { ISpriteConstructor } from '../../interfaces/sprite.interface';
import { Bullet } from './bullet';

export class Hammer extends Bullet {

  constructor(aParams: ISpriteConstructor) {
    super(aParams);
  }
  protected initSprite() {
    super.initSprite();
    this.setOrigin(0.5)
    this.body.setSize(16, 16);
    this.body.setCircle(8)
    this.body.setBounce(1,1);
  }

  update(): void {
    if (
      !Phaser.Geom.Intersects.RectangleToRectangle(
        this.getBounds(),
        this.getCurrentScene().cameras.main.worldView
      )||this.body.blocked.right||this.body.blocked.left
    ) {
      this.destroy();
    }else{
      this.setRotation(Math.atan(this.body.velocity.y/ this.body.velocity.x))
    }
  }

}
