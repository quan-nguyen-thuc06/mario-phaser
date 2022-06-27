import { Enemy } from './enemy';
import { ISpriteConstructor } from '../interfaces/sprite.interface';
import { Mario2 } from './mario2';

export class Bowser extends Enemy {
  body: Phaser.Physics.Arcade.Body;
	player: Mario2;
  constructor(aParams: ISpriteConstructor, player: Mario2) {
    super(aParams);
    this.speed = -30;
    this.dyingScoreValue = 100;
		this.player = player;
  }
  protected initSprite(){
    super.initSprite();
    this.body.setSize(14,26)
    this.body.setOffset(9,7)
  }
  update(): void {
    if (!this.isDying) {
			this.followPlayer();
			this.handleAnimations();
      if (this.isActivated) {
        // goomba is still alive
        // add speed to velocity x
        this.body.setVelocityX(this.speed);

        // if goomba is moving into obstacle from map layer, turn
        if (this.body.blocked.right) {
          this.speed = -50;
          this.body.velocity.x = this.speed;
        }
        else if(this.body.blocked.left){
          this.speed = 50;
          this.body.velocity.x = this.speed;
        }

        // apply walk animation
        this.anims.play('bowserWalk', true);
        
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
    } else {
      // goomba is dying, so stop animation, make velocity 0 and do not check collisions anymore
      this.anims.stop();
      this.body.setVelocity(0, 0);
      this.body.checkCollision.none = true;
    }
  }
	private handleAnimations(){
		if(this.speed > 0) {
			this.setFlipX(true);
		}
		else{
			this.setFlipX(false);
		}
	}
  public gotHitOnHead(): void {
    this.isDying = true;
    this.setFrame(2);
    this.showAndAddScore();
  }

  public gotHitFromBulletOrMarioHasStar(): void {
    this.isDying = true;
    this.body.setVelocityX(0);
    this.body.checkCollision.none = true;
    this.body.setVelocityY(-20);
    this.setFlipY(true);
  }

	private followPlayer(){
		if(!this.player.getIsDying()){
			if(this.player.x > this.x + 30){
				this.speed = 50;
			}
			else if(this.player.x < this.x - 30){
				this.speed = -50;
			}
		}
	}

  public setPlayer(player: Mario2){
    this.player = player;
  }
}
