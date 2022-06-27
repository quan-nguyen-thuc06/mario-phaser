import { ISpriteConstructor } from "../interfaces/sprite.interface";
import { Fire } from "./fire";
import { Mario } from "./mario";

export class Mario2 extends Mario{
  // game objects
  fires!: Phaser.GameObjects.Group;
  speedFire!: number;

  constructor(aParams: ISpriteConstructor){
      super(aParams);
      this.initFires();
      this.handleInputV2();
  }
  public getFires(): Phaser.GameObjects.Group {
      return this.fires;
  }
  private initFires() {
      // game objects
      this.fires = this.scene.add.group({
        /*classType: Bullet,*/
        active: true,
        maxSize: 3,
        runChildUpdate: true
      });
      this.speedFire = 200;
    }
  private handleInputV2(){
      this.scene.input.keyboard.on('keydown-X', ()=>this.handleShooting())
  }
  private handleShooting(): void {
    if(this.flipX === true){
      this.speedFire = -200;
    }
    else{
      this.speedFire = 200;
    }
      if(this.fires.getChildren().length <2){
        this.fires.add(
          new Fire({
              scene: this.scene,
              x: this.x,
              y: this.y,
              texture: 'fire'
            })
          );
          var fire = this.fires.getChildren()[this.fires.getChildren().length-1] as Fire;
          fire.x = this.x;
          fire.y = this.y;
          this.scene.physics.velocityFromRotation(-0.3, this.speedFire, fire.body.velocity);
      }
    }
}