
var socket = io();

var game;
var settings;
map_file = 'assets/tilemaps/maps/super_mario.json';

var monsters = new Array();
var towers = new Array();
var walls = new Array();
var spawns = new Array();

function sendSignal(signal){
    console.log('sending: '+signal);
    socket.emit(signal);
}

function sendJSON(signal, json){
    console.log('sending json');
    socket.emit(signal, json);
}

socket.on('tower_new', function(jsonTower){
  console.log("permission for new tower");
  var position = translateToFieldCoord(jsonTower.position.x, jsonTower.position.y);
  jsonTower.sprite = game.add.sprite(position.x,position.y, jsonTower.type);
  towers.push(jsonTower)
})
socket.on('tower_list', function(t_list){
  console.log("received t_list")
  initTowers(JSON.parse(t_list))
})

socket.on('spawn_new', function(jsonSpawn){
  console.log("setting new spawn");
  var position = translateToFieldCoord(jsonSpawn.position.x, jsonSpawn.position.y);
  jsonSpawn.sprite = game.add.sprite(position.x,position.y, 'spawn');
  spawns.push(jsonSpawn);
})

socket.on('monster_new', function(jsonMonster){
  console.log("spawning new monster");
  var position = translateToFieldCoord(jsonMonster.position.x, jsonMonster.position.y);
  jsonMonster.sprite = game.add.sprite(position.x,position.y, 'monster');
  monsters.push(jsonMonster);
})

socket.on('monster_update', function(monstersJ){
  console.log("received monster update");
  array = JSON.parse(monstersJ);
  console.log(monstersJ)
  console.log(array)
  updateMonsters(array)
  //var position = translateToFieldCoord(jsonMonster.position.x, jsonMonster.position.y);
  //jsonMonster.sprite = game.add.sprite(position.x,position.y, 'monster');
  //spawns.push(jsonMonster);
})

socket.on('monster_killed', function(index){
  monsters[index].sprite.destroy();
  monsters.splice(index, 1);
})

function initTowers(array){
  for(i=0; i < array.length; i++){
    var jsonTower = array[i];
    var position = translateToFieldCoord(jsonTower.position.x, jsonTower.position.y);
    jsonTower.sprite = game.add.sprite(position.x,position.y, jsonTower.type);
    towers.push(jsonTower)
  }
}

function updateMonsters(array){
  for(i = 0; i < array.length; i++){
    monsters[i].position = array[i].position;
    var xp = parseInt(array[i].position.x)
    var yp = parseInt(array[i].position.y)
    var pos = translateToFieldCoord(xp, yp);
    console.log(xp);
    monsters[i].sprite.y = pos.y;
    monsters[i].sprite.x = pos.x;
  }
}
