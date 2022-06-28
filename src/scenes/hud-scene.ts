import SceneKeys from "../Consts/scene-key";

export class HUDScene extends Phaser.Scene {
  private textElements: Map<string, Phaser.GameObjects.BitmapText>;
  private timer: Phaser.Time.TimerEvent;

  constructor() {
    super({
      key: SceneKeys.HUDScene
    });
  }

  create(): void {
    this.textElements = new Map([
      ['LIVES', this.addText(0, 0, `MARIOx ${this.registry.get('lives')}`)],
      ['WORLDTIME', this.addText(320, 0, `${this.registry.get('worldTime')}`)],
      ['SCORE', this.addText(160, 32, `${this.registry.get('score')}`)],
      ['COINS', this.addText(320, 32, `${this.registry.get('coins')}`)],
      ['WORLD', this.addText(384, 32, `${this.registry.get('world')}`)],
      ['TIME', this.addText(544, 32, `${this.registry.get('time')}`)]
    ]);

    // create events
    const level = this.scene.get(SceneKeys.GameScene);
    level.events.on('coinsChanged', this.updateCoins, this);
    level.events.on('scoreChanged', this.updateScore, this);
    level.events.on('livesChanged', this.updateLives, this);
    level.events.on('worldChanged', this.updateWorld, this);

    // add timer
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTime,
      callbackScope: this,
      loop: true
    });
  }

  private addText(
    x: number,
    y: number,
    value: string
  ): Phaser.GameObjects.BitmapText {
    return this.add.bitmapText(x, y, 'font', value, 32);
  }

  private updateTime() {
    this.registry.values.time -= 1;
    this.textElements.get('TIME').setText(`${this.registry.get('time')}`);
  }

  private updateCoins() {
    this.textElements
      .get('COINS')
      .setText(`${this.registry.get('coins')}`)
      .setX(320 - 32 * (this.registry.get('coins').toString().length - 1));
  }

  private updateScore() {
    this.textElements
      .get('SCORE')
      .setText(`${this.registry.get('score')}`)
      .setX(160 - 32 * (this.registry.get('score').toString().length - 1));
  }

  private updateLives() {
    this.textElements
      .get('LIVES')
      .setText(`Lives: ${this.registry.get('lives')}`);
  }

  private updateWorld() {
    // set world
    var preWorld = this.registry.get('world').toString();
    var nextWorld =parseInt(preWorld.split('-')[0]) + '-' + (parseInt(preWorld.split('-')[1]) + 1)
    this.registry.set('world', nextWorld);

    this.textElements
      .get('WORLD')
      .setText(`${this.registry.get('world')}`);
  }
}
