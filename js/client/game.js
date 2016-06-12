
/**
 * Created by frankz on 11.06.16.
 */
 $.getJSON(map_file, function(json){
     settings = json;
     game = new Phaser.Game(settings.width*settings.tilewidth,
         settings.height*settings.tileheight, Phaser.AUTO, '', { preload: preload, create: create, update: update });
 });

function preload() {
    game.canvas.oncontextmenu = function(e){e.preventDefault()}
    game.input.onDown.add(requestTower, this);

    game.load.tilemap('mario', map_file, null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tilemaps/tiles/super_mario.png');
    game.load.image('towert1', 'assets/TowerT1.png');
    game.load.image('spawn', 'assets/Spawn1.png');
    game.load.image('monster', 'assets/Monster1.png');
}

function create() {
    map = game.add.tilemap('mario');
    map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');
    layer = map.createLayer('World1');
    layer.resizeWorld();
    sendSignal('ready');
    //game.add.sprite(0, 0, 'ground');
    //game.add.sprite(0, 0, 'dude');
}

function translateToGameCoord(x, y){
  return {
    x: Math.floor(x/settings.tilewidth),
    y: Math.floor(y/settings.tileheight)
  };
}
function translateToFieldCoord(x,y){
  return {
    x: x*settings.tilewidth,
    y: y*settings.tileheight
  }
}

function update() {

}
