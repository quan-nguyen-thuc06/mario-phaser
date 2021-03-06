import { Bowser } from '../objects/enemy/bowser';
import { Box } from '../objects/box';
import { Brick } from '../objects/brick';
import { Collectible } from '../objects/collectible';
import { Enemy } from '../objects/enemy/enemy';
import { Fire } from '../objects/bullet/fire';
import { Mario2 } from '../objects/mario/mario2';
import { Platform } from '../objects/platform';
import { Portal } from '../objects/portal';
import { Turtle } from '../objects/enemy/turtle';
import { Goomba } from '../objects/enemy/goomba';
import { Hammer } from '../objects/bullet/hammer';
import { Mario } from '../objects/mario/mario';
import { FireFly } from '../objects/fireFly';
import SceneKeys from '../Consts/scene-key';

export class GameScene extends Phaser.Scene {
  // tilemap
  private map: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  private backgroundLayer: Phaser.Tilemaps.TilemapLayer;
  private checkLayer: Phaser.Tilemaps.TilemapLayer;
  private foregroundLayer: Phaser.Tilemaps.TilemapLayer;

  // game objects
  private boxes: Phaser.GameObjects.Group;
  private bricks: Phaser.GameObjects.Group;
  private collectibles: Phaser.GameObjects.Group;
  private enemies: Phaser.GameObjects.Group;
  private platforms: Phaser.GameObjects.Group;
  private player: Mario2;
  private portals: Phaser.GameObjects.Group;
  private fireFlys: Phaser.GameObjects.Group;

  constructor() {
    super({
      key: SceneKeys.GameScene
    });
  }

  init(): void {}

  create(): void {
    // *****************************************************************
    // SETUP TILEMAP
    // *****************************************************************

    // create our tilemap from Tiled JSON
    this.map = this.make.tilemap({  key: this.registry.get('level') });
    // add our tileset and layers to our tilemap
    this.tileset = this.map.addTilesetImage('tiles2');
    this.backgroundLayer = this.map.createLayer(
      'backgroundLayer',
      this.tileset,

    );
    this.checkLayer = this.map.createLayer(
      'checkLayer',
      this.tileset,
      
      );
    this.checkLayer.setName('checkLayer');

    this.foregroundLayer = this.map.createLayer(
      'foregroundLayer',
      this.tileset,

    );
    this.foregroundLayer.setName('foregroundLayer');

    // set collision for tiles with the property collide set to true
    this.foregroundLayer.setCollisionByProperty({ collide: true });
    this.checkLayer.setCollisionByProperty({collide: true});

    // *****************************************************************
    // GAME OBJECTS
    // *****************************************************************
    this.portals = this.add.group({
      /*classType: Portal,*/
      runChildUpdate: true
    });

    this.boxes = this.add.group({
      /*classType: Box,*/
      runChildUpdate: true
    });

    this.bricks = this.add.group({
      /*classType: Brick,*/
      runChildUpdate: true
    });

    this.collectibles = this.add.group({
      /*classType: Collectible,*/
      runChildUpdate: true
    });

    this.enemies = this.add.group({
      runChildUpdate: true
    });

    this.platforms = this.add.group({
      /*classType: Platform,*/
      runChildUpdate: true
    });

    this.fireFlys = this.add.group({
      /*classType: FireFly,*/
      runChildUpdate: true
    });

    this.loadObjectsFromTilemap();

    // *****************************************************************
    // COLLIDERS
    // *****************************************************************
    this.physics.add.collider(this.player, this.foregroundLayer);
    this.physics.add.collider(this.player.getFires(), this.foregroundLayer);
    this.physics.add.collider(this.enemies, this.foregroundLayer);
    this.physics.add.collider(this.enemies, this.checkLayer);
    this.physics.add.collider(this.enemies, this.boxes);
    this.physics.add.collider(this.enemies, this.bricks);

    this.physics.add.collider(
      this.player,
      this.boxes,
      this.playerHitBox,
      null,
      this
    );

    this.physics.add.collider(
      this.player,
      this.bricks,
      this.playerHitBrick,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.handlePlayerEnemyOverlap,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.fireFlys,
      this.handlePlayerFireFlyOverlap,
      null,
      this
    );

    this.physics.add.overlap(
      this.player.getFires(),
      this.enemies,
      this.handleFireEnemyOverlap,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.portals,
      this.handlePlayerPortalOverlap,
      null,
      this
    );

    this.physics.add.collider(
      this.player,
      this.platforms,
      this.handlePlayerOnPlatform,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.collectibles,
      this.handlePlayerCollectiblesOverlap,
      null,
      this
    );

    // *****************************************************************
    // CAMERA
    // *****************************************************************
    this.cameras.main.startFollow(this.player);
    
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.cameras.main.setZoom(2)
  }

  update(): void {
    this.player.update();
  }

  private loadObjectsFromTilemap(): void {
    // get the object layer in the tilemap named 'objects'
    const objects = this.map.getObjectLayer('objects').objects as any[];

    objects.forEach((object) => {
      if (object.type === 'portal') {
        this.portals.add(
          new Portal({
            scene: this,
            x: object.x,
            y: object.y,
            height: object.width,
            width: object.height,
            spawn: {
              x: object.properties[1].value,
              y: object.properties[2].value,
              dir: object.properties[0].value
            }
          }).setName(object.name)
        );
      }

      if (object.type === 'player') {
        this.player = new Mario2({
          scene: this,
          x: object.x,
          y: object.y,
          texture: 'mario'
        });
      }

      if (object.type === 'goomba') {
        this.enemies.add(
          new Goomba({
            scene: this,
            x: object.x,
            y: object.y,
            texture: 'enemies'
          })
        );
      }

      if (object.type === 'turtle') {
        this.enemies.add(
          new Turtle({
            scene: this,
            x: object.x,
            y: object.y,
            texture: 'enemies'
          })
        );
      }

      if (object.type === 'bowser') {
        var bowser = new Bowser({
          scene: this,
          x: object.x,
          y: object.y,
          texture: 'enemies'
        }, this.player);
        bowser.setProperties(object.properties[1].value, object.properties[0].value)
        this.enemies.add(
          bowser
        );

        // set collider
        this.physics.add.collider(bowser.getHammer(), this.foregroundLayer);
        this.physics.add.overlap(
          this.player,
          bowser.getHammer(),
          this.handlePlayerHammerOverlap,
          null,
          this
        );
      }

      if (object.type === 'brick') {
        this.bricks.add(
          new Brick({
            scene: this,
            x: object.x,
            y: object.y,
            texture: 'brick',
            value: 50
          })
        );
      }

      if (object.type === 'box') {
        this.boxes.add(
          new Box({
            scene: this,
            content: object.properties[0].value,
            x: object.x,
            y: object.y,
            texture: 'box'
          })
        );
      }

      if (object.type === 'fireFly') {
        this.fireFlys.add(
          new FireFly({
          scene: this,
          x: object.x,
          y: object.y,
          texture: 'fire'
        }))
      }

      if (object.type === 'collectible') {
        this.collectibles.add(
          new Collectible({
            scene: this,
            x: object.x,
            y: object.y,
            texture: object.properties[0].value,
            points: 100
          })
        );
      }

      if (object.type === 'platformMovingUpAndDown') {
        this.platforms.add(
          new Platform({
            scene: this,
            x: object.x,
            y: object.y,
            texture: 'platform',
            tweenProps: {
              y: {
                value: object.y - 100,
                duration: 1500,
                ease: 'Power0'
              }
            }
          })
        );
      }

      if (object.name === 'platformMovingLeftAndRight') {
        let rangeTranform = 100;
        if(object.type === 'platformMovingRight')
          rangeTranform = -100;
        this.platforms.add(
          new Platform({
            scene: this,
            x: object.x,
            y: object.y,
            texture: 'platform',
            tweenProps: {
              x: {
                value: object.x + rangeTranform,
                duration: 3000,
                ease: 'Power0',
              },
            }
          })
        );
      }
    });
  }

  /**
   * Player <-> Enemy Overlap
   * @param _player [Mario]
   * @param _enemy  [Enemy]
   */
  private handlePlayerEnemyOverlap(_player: Mario, _enemy: Enemy): void {
    if (_player.body.touching.down && _enemy.body.touching.up) {
      // player hit enemy on top
      _player.bounceUpAfterHitEnemyOnHead();

      if(_enemy instanceof Goomba || _enemy instanceof Turtle || (_enemy instanceof Bowser && _player.getMarioSize()=='big')){
        if(!(_enemy instanceof Turtle) || (_enemy instanceof Turtle && _enemy.isDying)){
          this.add.tween({
            targets: _enemy,
            props: { alpha: 0 },
            duration: 1000,
            ease: 'Power0',
            yoyo: false,
            onComplete: function () {
              _enemy.isDead();
            }
          });
        }
        _enemy.gotHitOnHead();
      
    }
    } else {
      // player got hit from the side or on the head
      if (!_player.body.touching.down && !_enemy.body.touching.up &&_player.getVulnerable()) {
        _player.gotHit();
      }
    }
  }

  /**
   * Player <-> FireFly Overlap
   * @param _player [Mario]
   * @param _fireFly  [FireFly]
   */
  private handlePlayerFireFlyOverlap(_player: Mario2, _fireFly: FireFly){
    if (_player.getVulnerable()) {
      _player.setMarioSize("small"); 
      _player.gotHit(); 
    }
  }

  private handlePlayerHammerOverlap(_player: Mario2, _hammer: Hammer){
    if (_player.getVulnerable() && !_player.body.touching.down) {
      _player.setMarioSize("small");
      _player.gotHit();
    }
  }

  /**
   * Fire <-> Enemy Overlap
   * @param _fire [Fire]
   * @param _enemy  [Enemy]
   */
   private handleFireEnemyOverlap(_fire: Fire, _enemy: Enemy): void {
    _fire.destroyBullet();
    if(_enemy instanceof Goomba || _enemy instanceof Turtle) {
      this.add.tween({
        targets: _enemy,
        props: { alpha: 0 },
        duration: 1000,
        ease: 'Power0',
        yoyo: false,
        onComplete: function () {
          _enemy.isDead();
        }
      });
      _enemy.gotHitFromBulletOrMarioHasStar();
    }
  }

  /**
   * Player <-> Box Collision
   * @param _player [Mario]
   * @param _box    [Box]
   */
  private playerHitBox(_player: Mario2, _box: Box): void {
    if (_box.body.touching.down && _box.active) {
      // ok, mario has really hit a box on the downside
      _box.yoyoTheBoxUpAndDown();
      this.collectibles.add(_box.spawnBoxContent());

      switch (_box.getBoxContentString()) {
        // have a look what is inside the box! Christmas time!
        case 'coin': {
          _box.tweenBoxContent({ y: _box.y - 40, alpha: 0 }, 700, function () {
            _box.getContent().destroy();
          });

          _box.addCoinAndScore(1, 100);
          break;
        }
        case 'rotatingCoin': {
          _box.tweenBoxContent({ y: _box.y - 40, alpha: 0 }, 700, function () {
            _box.getContent().destroy();
          });

          _box.addCoinAndScore(1, 100);
          break;
        }
        case 'flower': {
          _box.tweenBoxContent({ y: _box.y - 18 }, 200, function () {
            _box.getContent().anims.play('flower');
          });
          break;
        }
        case 'mushroom': {
          _box.popUpCollectible();
          break;
        }
        case 'star': {
          _box.popUpCollectible();
          break;
        }
        default: {
          break;
        }
      }
      _box.startHitTimeline();
    }
  }

  private playerHitBrick(_player: Mario, _brick: Brick): void {
    if (_brick.body.touching.down) {
      if(_player.getMarioSize()=="big"){
        _brick.superMarioHitBrick();
      }
      else{
        _brick.yoyoTheBrickUpAndDown()
      }
    }
  }

  private handlePlayerPortalOverlap(_player: Mario, _portal: Portal): void {
    if (
      (_player.getKeys().get('DOWN').isDown &&
        _portal.getPortalDestination().dir === 'down') ||
      (_player.getKeys().get('RIGHT').isDown &&
        _portal.getPortalDestination().dir === 'right')
    ) {
      // set new level and new destination for mario
      this.registry.set('level', _portal.name);
      this.registry.set('spawn', {
        x: _portal.getPortalDestination().x,
        y: _portal.getPortalDestination().y,
        dir: _portal.getPortalDestination().dir
      });

      // set world
      this.events.emit('worldChanged');

      // restart the game scene
      this.scene.restart();
    } else if (_portal.name === 'exit') {
      this.scene.stop(SceneKeys.GameScene);
      this.scene.pause(SceneKeys.HUDScene);
      this.scene.start(SceneKeys.WonScene);
    }
  }

  private handlePlayerCollectiblesOverlap(
    _player: Mario2,
    _collectible: Collectible
  ): void {
    switch (_collectible.texture.key) {
      case 'flower': {
        _player.setIsFireMan(true);
        break;
      }
      case 'mushroom': {
        _player.growMario();
        break;
      }
      case 'star': {
        break;
      }
      default: {
        break;
      }
    }
    _collectible.collected();
  }

  // TODO!!!
  private handlePlayerOnPlatform(player: Mario, platform: Platform): void {
    if (
      platform.body.moves &&
      platform.body.touching.up &&
      player.body.touching.down
    ) {
      if(player.body.velocity.x == 0 && !player.getKeys().get('JUMP').isDown)
        player.body.setGravityY(10000);
      else{
        player.body.setGravityY(0);
      }
    }
  }
}
