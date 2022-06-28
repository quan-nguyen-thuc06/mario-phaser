import SceneKeys from "../Consts/scene-key";

export class MenuScene extends Phaser.Scene {
  private startKey: Phaser.Input.Keyboard.Key;
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];

  constructor() {
    super({
      key: 'MenuScene'
    });
  }

  init(): void {
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );
    this.startKey.isDown = false;
    this.initGlobalDataManager();
  }

  create(): void {
    this.add.image(0, 0, 'title')
      .setOrigin(0, 0)
      .setDisplaySize(this.scale.width,this.scale.height);

    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 88,
        this.scale.height - 90,
        'font',
        'START',
        32
      )
    );
  }

  update(): void {
    if (this.startKey.isDown) {
      this.scene.start(SceneKeys.HUDScene);
      this.scene.start(SceneKeys.GameScene);
      this.scene.bringToTop(SceneKeys.HUDScene);
    }
  }

  private initGlobalDataManager(): void {
    this.registry.set('time', 400);
    this.registry.set('level', 'newLevel1');
    this.registry.set('world', '1-1');
    this.registry.set('worldTime', 'WORLD TIME');
    this.registry.set('score', 0);
    this.registry.set('coins', 0);
    this.registry.set('lives', 2);
    this.registry.set('spawn', { x: 12, y: 44, dir: 'down' });
    this.registry.set('marioSize', 'small');
  }
}
