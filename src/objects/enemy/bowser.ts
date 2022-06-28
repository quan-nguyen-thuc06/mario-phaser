import { Enemy } from './enemy';
import { ISpriteConstructor } from '../../interfaces/sprite.interface';
import { Mario2 } from '../mario/mario2';
import { Hammer } from '../bullet/hammer';

export class Bowser extends Enemy {
  body: Phaser.Physics.Arcade.Body;
  // game objects
	player: Mario2;
  hammers!: Phaser.GameObjects.Group;
  speedHammer!: number;

  // variables
  isThrowHammer!: boolean;
  isFollowPlayer!: boolean;

  constructor(aParams: ISpriteConstructor, player: Mario2) {
    super(aParams);
    this.speed = -30;
    this.dyingScoreValue = 100;
		this.player = player;
    this.initHammers();
    this.initTimer();
    
  }

  public setProperties(isThrowHammer: boolean, isFollowPlayer: boolean) {
    this.isThrowHammer = isThrowHammer;
    this.isFollowPlayer = isFollowPlayer;
  }

  public getHammer(): Phaser.GameObjects.Group {
    return this.hammers;
  }

  protected initSprite(){
    super.initSprite();
    this.body.setSize(14,26)
    this.body.setOffset(9,7)

    // set values for variables
    this.isThrowHammer = false;
    this.isFollowPlayer = false;
  }

  private initHammers() {
    // game objects
    this.hammers = this.scene.add.group({
      /*classType: Bullet,*/
      active: true,
      maxSize: 2,
      runChildUpdate: true
    });
    this.speedHammer = 0;
  }

  private initTimer(){
    this.scene.time.addEvent({ delay: 1000 ,callback: this.handleShooting, callbackScope: this , loop: true });
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
    this.setFrame(9);
    this.showAndAddScore();
  }

	private followPlayer(){
		if(!this.player.getIsDying()&&this.isFollowPlayer){
			if(this.player.x > this.x + 30){
				this.speed = 50;
			}
			else if(this.player.x < this.x - 30){
				this.speed = -50;
			}
		}
	}

  private handleShooting(): void {
    if(this.isThrowHammer){

      if(this.flipX === true){
        this.speedHammer = 150;
      }
      else{
        this.speedHammer = -150;
      }

      if(this.hammers.getChildren().length <this.hammers.maxSize){
          this.hammers.add(
            new Hammer({
                scene: this.scene,
                x: this.x,
                y: this.y,
                texture: 'hammer'
              })
            );
            var fire = this.hammers.getChildren()[this.hammers.getChildren().length-1] as Hammer;
            fire.x = this.x;
            fire.y = this.y;
            this.scene.physics.velocityFromRotation(0.2, this.speedHammer, fire.body.velocity);
      }
    }
  }
}
