import { Enemy } from './enemy';
import { ISpriteConstructor } from '../interfaces/sprite.interface';

export class Turtle extends Enemy {
  body: Phaser.Physics.Arcade.Body;
  constSpeed!: number;
  constructor(aParams: ISpriteConstructor) {
    super(aParams);
    this.constSpeed = -20;
    this.speed = this.constSpeed;
    this.dyingScoreValue = 100;
  }

  update(): void {
      if (this.isActivated) {

        // apply animation
        if (this.isDying){
          this.anims.stop()
        }
        else this.anims.play('turtleWalk', true);

        // add speed to velocity x
        this.body.setVelocityX(this.speed);
        
        // if goomba is moving into obstacle from map layer, turn
        if (this.body.blocked.right) {
          this.speed = this.constSpeed;
          this.body.velocity.x = this.speed;
          this.flipX = false;
        }
        else if(this.body.blocked.left){
          this.speed = -this.constSpeed;
          this.body.velocity.x = this.speed;
          this.flipX = true;
        }

      } else {
        if (
          Phaser.Geom.Intersects.RectangleToRectangle(
            this.getBounds(),
            this.currentScene.cameras.main.worldView
          )
        ) {
          this.isActivated = true;
        }
      }
  }

  public gotHitOnHead(): void {
    this.setFrame(2);
    if(!this.isDying)
      this.constSpeed = -60;
    else{
      this.body.setVelocity(0, 0);
      this.body.checkCollision.none = true;
    }
    this.speed = this.constSpeed;
    this.showAndAddScore();
    this.isDying = true;
  }

  public gotHitFromBulletOrMarioHasStar(): void {
    this.setFrame(2);
    this.isDying = true;
    this.constSpeed = 0;
    this.speed =0;
    this.body.checkCollision.none = true;
    this.body.setVelocityY(-20);
    this.setFlipY(true);
  }

  public isDead(): void {
    this.destroy();
  }
}
