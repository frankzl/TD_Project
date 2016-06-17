
var socket = io();

var game;
var settings;
map_file = 'assets/tilemaps/maps/super_mario.json';

var monsters = new Array();
var towers = new Array();
var bullets = new Array();
var walls = new Array();
var spawns = new Array();

function sendSignal(signal){
  console.log(socket)
    console.log('sending: '+signal);
    socket.emit(signal);
}

function sendJSON(signal, json){
    console.log('sending json');
    socket.emit(signal, json);
}

function buildTower(jsonTower){
  console.log(socket);
  console.log("building: ");
  var position = translateToFieldCoord(jsonTower.position.x, jsonTower.position.y);
  jsonTower.sprite = game.add.sprite(position.x,position.y, "towert1");
  towers.push(jsonTower)
}

socket.on('tower_new', function(jsonTower){
  console.log("permission for new tower");
  buildTower(jsonTower);
})

socket.on('tower_list', function(t_list){
  console.log("received t_list")
  var t = JSON.parse(t_list)
  initTowers(JSON.parse(t_list))
})

socket.on('monster_list', function(m_list){
  console.log("received m_list");
  var list = JSON.parse(m_list);
  if(list == undefined){return;}
  for( i = 0; i < list.length; i++){
    //var position = translateToFieldCoord(m_list[i].position.x, m_list[i].position.y);
    //m_list[i].sprite = game.add.sprite(position.x,position.y, 'monster');
    monsters.push(m_list[i]);
  }
})

socket.on('spawn_new', function(jsonSpawn){
  console.log("setting new spawn");
  var position = translateToFieldCoord(jsonSpawn.position.x, jsonSpawn.position.y);
  jsonSpawn.sprite = game.add.sprite(position.x,position.y, 'spawn');
  spawns.push(jsonSpawn);
})

socket.on('bullet_new', function(shot){
  console.log("creating bullet");
  shot.sprite = game.add.sprite(shot.position.x,shot.position.y, 'bullet');
  bullets.push(shot);
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
  updateMonsters(array)
  //var position = translateToFieldCoord(jsonMonster.position.x, jsonMonster.position.y);
  //jsonMonster.sprite = game.add.sprite(position.x,position.y, 'monster');
  //spawns.push(jsonMonster);
})

socket.on('bullet_update', function(bullets){
  console.log("received bullet update");
  array = JSON.parse(bullets);
  updateBullets(array);
})

socket.on('monster_killed', function(index){
  monsters[index].sprite.destroy();
  monsters.splice(index, 1);
})

socket.on('bullet_killed', function(index){
  console.log("bullet_killed")
  bullets[index].sprite.destroy();
  bullets.splice(index, 1);
})

function initTowers(array){
  for(i=0; i < array.length; i++){
    buildTower(array[i])
  }
}

function spawnMonster(jsonMonster){
  console.log("spawning new monster");
  var position = translateToFieldCoord(jsonMonster.position.x, jsonMonster.position.y);
  jsonMonster.sprite = game.add.sprite(position.x,position.y, 'monster');
  monsters.push(jsonMonster);
}

function updateMonsters(array){
  for(i = 0; i < array.length; i++){
    monsters[i].position = array[i].position;
    var xp = parseInt(array[i].position.x)
    var yp = parseInt(array[i].position.y)
    var pos = translateToFieldCoord(xp, yp);
    monsters[i].sprite.y = pos.y;
    monsters[i].sprite.x = pos.x;
  }
}

function updateBullets(array){
  for(i = 0; i < array.length; i++){
    console.log(array[i].position)
    bullets[i].position = array[i].position;
    var xp = parseInt(array[i].position.x)
    var yp = parseInt(array[i].position.y)
    bullets[i].sprite.y = yp;
    bullets[i].sprite.x = xp;
  }
}
