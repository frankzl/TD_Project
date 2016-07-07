
/**
 * Created by frankz on 11.06.16.
 */

var settings;

var UPDATE_INTERVAL = 500;

var distance_map = new Array();
var nextDir_map = new Array();
var monster_map = new Array();

var monsters = new Array();
var towers = new Array();
var bullets = new Array();
var walls = new Array();
var spawns = new Array();

var Monster = require('./monster')
var Tower = require('./tower')
var Bullet = require('./bullet')
var io;

exports.initGame = function(path, socket){
  io = socket;
  settings = require(path)
  preload();
  create();
  distance_map = new Array(settings.width);
  nextDir_map = new Array(settings.width);
  monster_map = new Array(settings.width);
  for(i=0; i<settings.width; i++){
    nextDir_map[i]  = new Array(settings.height);
    distance_map[i] = new Array(settings.height)
    monster_map[i]  = new Array(settings.height)
    for(j=0; j<settings.height; j++){
      distance_map[i][j] = 1000;
      monster_map[i][j] = -1;
      nextDir_map[i][j] = 0;
    }
  }
  findShortestPath(7, 14, 0);
  setNextDirMap();
  console.log(distance_map);
}

exports.buildTower = function(tower){
  tower.type = 'towert1';
  distance_map[tower.position.x][tower.position.y] = -1;
  io.emit('tower_new', tower)
  towers.push(new Tower.create(tower, monster_map, monsters));
  resetDistance_map();
  findShortestPath(7, 14, 0);
  setNextDirMap();
}

exports.getMonsterList = function(){
  if(monsters != undefined && monsters.length != 0){
    return JSON.stringify(monsters);
  }
  return null;
}

exports.getBulletList = function(){
  var positionList = getPositionList(bullets);
  if(positionList == null){return null}
  return JSON.stringify(positionList);
}

function getPositionList(array){
  var list = [];
  for(i = 0; i < bullets.length; i++){
    var json = {position: {x: array[i].position.x, y: array[i].position.y}};
    list.push(json);
  }
  if(list.length == 0){return null}
  return list;
}

exports.getTowerList = function(){
  var t_list = [];
  if(towers == undefined || towers.length == 0){return null;}
  for(i = 0; i < towers.length && towers != undefined; i++){
      var json = {position: {x:towers[i].position.x, y:towers[i].position.y}, type: 0};
    console.log(json);
    t_list.push(json);
  }
  return t_list;
};

exports.spawnMonster = function(x, y, dir_x, dir_y, velocity){
  var m = {
    position: {x: 7, y: 0},
    direction: {x: 0, y: 0},
    velocity: 1
  }
  monsters.push(new Monster.create(m));
  io.emit('monster_new', m);
}

setInterval(update, UPDATE_INTERVAL);

function preload() {
  //preload the world here
}

function create() {
    console.log("success");
}

function update(){
  update_towers();
  update_monsterMovement();
}

exports.update_bullets = function(){
  if(bullets == undefined){return null}
  for( i = 0; i < bullets.length; i++){
    if(bullets[i].position.x < 0 || bullets[i].position.y < 0 ||
        bullets[i].position.x > settings.width*settings.tilewidth || bullets[i].position.y > settings.height*settings.tileheight){
        bullets.splice(i, 1);
        io.sockets.emit('bullet_killed', i);
        i--;
    }else{
      bullets[i].fly()
    }
  }
}

function update_towers(){
  for(i = 0; i < towers.length; i++){
    if(towers[i].acquireTarget()){
      console.log("creating bullet");
      var shot = towers[i].generateBullet();
      if(shot != null){
        shot.target = translateToFieldCoord(shot.target.x, shot.target.y);
        shot.position = translateToFieldCoord(shot.position.x, shot.position.y);
        shot.position.x += settings.tilewidth/2;
        shot.position.y += settings.tileheight/2;
        bullets.push(new Bullet.create(shot));
        io.emit('bullet_new', shot);
      }
    }
  }
}

function update_monsterMovement(){
  //needed because monsters are delete from the list
  //the index from the last call wont be retrieved
  var currentIndex = 0;
  if(monsters != undefined && monsters.length != 0){
    for(i = 0; i < monsters.length; i++){
      //var next = nextPos(monsters[i].position);
      var current = monsters[i].position;
      if(monster_map[current.x][current.y] == currentIndex){
        monster_map[current.x][current.y] = -1;
      }
      var next = nextDir_map[monsters[i].position.x][monsters[i].position.y];
      console.log("direction")
      console.log(next)
      monsters[i].direction.x = next.x;
      monsters[i].direction.y = next.y;
      //monsters[i].jump(next.x, next.y);

      console.log(monsters[i].direction)
      if(monsters[i].move() && monsters[i].position.y >= settings.height-1){
        monsters.splice(i, 1);
        console.log("removed at index: "+i);
        io.sockets.emit('monster_killed', i);
        i--;
      }else{
        console.log(monsters[i].position.x+"||||"+monsters[i].position.y)
        monster_map[monsters[i].position.x][monsters[i].position.y] = i;
      }
      currentIndex++;
    }
    io.sockets.emit('monster_update', JSON.stringify(monsters));
  }
}

function resetArray(array, value){
  for(i=0; i<settings.width; i++){
    for(j=0; j<settings.height; j++){
      if(array[i][j] >= 0){
        array[i][j] = value;
      }
    }
  }
}

var resetMonster_map = function(){resetArray(monster_map, -1)}
var resetDistance_map = function(){
  resetArray(distance_map, 1000);
  resetArray(nextDir_map, 0);
}

function findShortestPath(x, y, dist){
  if(x<0 || x>=settings.width || y<0 || y>=settings.height){
    return;
  }
  if(distance_map[x][y] < 0){
    return;
  }
  else if (distance_map[x][y] > dist){
    distance_map[x][y] = dist;
    findShortestPath(x  , y+1, dist+1);
    findShortestPath(x  , y-1, dist+1);
    findShortestPath(x-1, y  , dist+1);
    findShortestPath(x+1, y  , dist+1);
  }
}

function setNextDirMap(){
  for( x_i = 0; x_i < settings.width; x_i++) {
    for( y_i = 0; y_i < settings.height; y_i++){
      var nextPos = getNextPosition(x_i, y_i);
      if(nextPos == null){
        nextDir_map[x_i][y_i] = {x: 0, y: 0};
      }else{
        nextDir_map[x_i][y_i] = {x:(nextPos.x-x_i), y:(nextPos.y-y_i)};
      }
      if(nextDir_map[x_i][y_i].x == -8){
        console.log("somewhere here");
        console.log(nextPos);
    console.log(x_i+";."+y_i)}
    }
  }
  console.log(nextDir_map);
}

var getNextPosition = function(xp, yp){return nextPos({x:xp, y:yp})}

function nextPos(position){
  var x = position.x;
  var y = position.y;
  var next_x = -1;
  var next_y = -1;
  var x1 = x-1, y1 = y;
  var dist = 1000;
  if(x==7 && y==0){console.log("here")}
  if(x1>=0 && x1<settings.width && y1>=0 && y1<settings.height &&
      (distance_map[x1][y1] >= 0) && dist > distance_map[x-1][y]){
      next_x = x1; next_y = y1; dist = distance_map[x-1][y];
      if(x == 7 && y == 0){
        var temp = (distance_map[x1][y1]>=0)
        console.log("h"+temp)
        console.log("d:"+(distance_map[x1][y1]))}
  }
  x1 = x+1; y1 = y;
  if(x1>=0 && x1<settings.width && y1>=0 && y1<settings.height &&
      distance_map[x1][y1]>= 0 && dist > distance_map[x+1][y]){
      next_x = x+1; next_y = y; dist = distance_map[x+1][y];
      if(x == 7 && y == 0){
        var temp = (distance_map[x1][y1]>=0)
        console.log("h"+temp)
        console.log("d:"+(distance_map[x1][y1]))}
  }
  x1 = x; y1 = y-1;
  if(x1>=0 && x1<settings.width && y1>=0 && y1<settings.height &&
      distance_map[x1][y1]>=0 && dist > distance_map[x][y-1]){
      next_x = x; next_y = y-1; dist = distance_map[x][y-1];
      if(x == 7 && y == 0){
        var temp = (distance_map[x1][y1]>=0)
        console.log("h"+temp)
        console.log("d:"+(distance_map[x1][y1]))}
  }
  x1 = x; y1 = y+1;
  if(x1>=0 && x1<settings.width && y1>=0 && y1<settings.height &&
      distance_map[x1][y1]>=0 && dist >= distance_map[x][y+1]){
      next_x = x; next_y = y+1; dist = distance_map[x][y+1];
      if(x == 7 && y == 0){
        var temp = (distance_map[x1][y1]>=0)
        console.log("h"+temp)
        console.log("d:"+(distance_map[x1][y1]))}
  }
  if(next_x == -1){return null}
  return {x: next_x, y:next_y};
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
    y: (y*settings.tileheight)
  }
}
