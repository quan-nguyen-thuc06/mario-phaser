import { Mario } from "../objects/mario";

export class Level2 extends Phaser.Scene{
    private player: Mario;
    private map: Phaser.Tilemaps.Tilemap;
    private tileset: Phaser.Tilemaps.Tileset;
    private backgroundLayer: Phaser.Tilemaps.TilemapLayer;
    private foregroundLayer: Phaser.Tilemaps.TilemapLayer;
    
    constructor(){
        super("Level2");
    }
    create()
    {
		this.map = this.make.tilemap({ key: "level2"});
        // add our tileset and layers to our tilemap
        this.tileset = this.map.addTilesetImage('map', 'tiles')
		
		this.foregroundLayer = this.map.createLayer('foregroundLayer', this.tileset)
		this.backgroundLayer = this.map.createLayer('backgroundLayer', this.tileset)
        this.foregroundLayer.setName('foregroundLayer');

        // set collision for tiles with the property collide set to true
        this.foregroundLayer.setCollisionByProperty({ collide: true });
        this.loadObjectsFromTilemap();
        this.physics.add.collider(this.player, this.foregroundLayer,()=>{
            console.log("collision with collision");
        });
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
    }

    private loadObjectsFromTilemap(): void {
        // get the object layer in the tilemap named 'objects'
        const objects = this.map.getObjectLayer('objects').objects as any[];
    
        objects.forEach((object) => {
          if (object.type === 'player') {
            this.player = new Mario({
              scene: this,
              x: 12,
              y: 44,
              texture: 'mario'
            });
          }
        })
    }
}