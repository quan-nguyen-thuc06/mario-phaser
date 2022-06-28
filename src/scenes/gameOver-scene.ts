import SceneKeys from "../Consts/scene-key";

export class GameOverScene extends Phaser.Scene {
    private startKey: Phaser.Input.Keyboard.Key;
    private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];
  
    constructor() {
      super({
        key: SceneKeys.GameOverScene
      });
    }
  
    init(): void {
      this.startKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.S
      );
      this.startKey.isDown = false;
    }
  
    create(): void {
      this.add.image(0, 0, 'gameOver')
        .setOrigin(0, 0)
        .setDisplaySize(this.scale.width,this.scale.height);
  
      this.bitmapTexts.push(
        this.add.bitmapText(
          this.sys.canvas.width / 2 - 88,
          this.scale.height - 100,
          'font',
          'Continue',
          32
        )
      );
    }
  
    update(): void {
      if (this.startKey.isDown) {
        this.scene.start(SceneKeys.MenuScene);
        this.scene.stop(SceneKeys.HUDScene);
      }
    }
  }
  