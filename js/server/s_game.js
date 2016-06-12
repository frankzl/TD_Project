
/**
 * Created by frankz on 11.06.16.
 */

var game;
var settings;

//to check movement of minions
var obstacles = new Array();

var monsters = new Array();
var towers = new Array();
var walls = new Array();
var spawns = new Array();

var Monster = require('./monster')
var Tower = require('./tower')

var io;

exports.initGame = function(path, socket){
  io = socket;
  settings = require(path)

  preload();
  create();
  obstacles = new Array(settings.width);
  for(i=0; i<settings.width; i++){
    obstacles[i] = new Array(settings.height)
    for(j=0; j<settings.height; j++){
      obstacles[i][j] = 1000;
    }
  }
  findShortestPath(7, 14, 0);
  console.log(obstacles);
}

exports.buildTower = function(tower){
  tower.type = 'towert1';
  towers.push(tower);
  obstacles[tower.position.x][tower.position.y] = -1;
  io.emit('tower_new', tower)
  resetObstacles();
  findShortestPath(7, 14, 0);
}
exports.getTowerList = function(){return towers}
exports.spawnMonster = function(x, y, dir_x, dir_y, velocity){
  var m = {
    position: {x: 7, y: 0},
    direction: {x: 0, y: 1},
    velocity: 1
  }
  monsters.push(new Monster.create(m));
  io.emit('monster_new', m);
}

setInterval(update, 500);

function preload() {
  //preload the world here
}

function create() {
    console.log("success");
}

function update(){
  if(monsters != undefined && monsters.length != 0){
    for(i = 0; i < monsters.length; i++){

      console.log(monsters[i].position);
      var next = nextPos(monsters[i].position);

      monsters[i].jump(next.x, next.y);
      if(monsters[i].position.y >= settings.height-1){
        monsters.splice(i, 1);
        console.log("removed at index: "+i);
        io.emit('monster_killed', i);
      }
    }

    io.emit('monster_update', JSON.stringify(monsters));
  }
}

function resetObstacles(){
  for(i=0; i<settings.width; i++){
    for(j=0; j<settings.height; j++){
      if(obstacles[i][j] >= 0){
        obstacles[i][j] = 1000;
      }
    }
  }
}

function findShortestPath(x, y, dist){

  if(x<0 || x>=settings.width || y<0 || y>=settings.height){
    return;
  }
  if(obstacles[x][y] < 0){
    return;
  }
  else if (obstacles[x][y] > dist){
    obstacles[x][y] = dist;
    findShortestPath(x  , y+1, dist+1);
    findShortestPath(x  , y-1, dist+1);
    findShortestPath(x-1, y  , dist+1);
    findShortestPath(x+1, y  , dist+1);
  }
}

function nextPos(position){
  var x = position.x;
  var y = position.y;
  var next_x = -1;
  var next_y = -1;
  var x1 = position.x-1, y1 = position.y;
  var dist = 1000;

  if(x1>0 && x1<settings.width && y1>0 && y1<settings.height &&
      obstacles[x1][y1] >= 0 && dist > obstacles[x-1][y]){
      next_x = x1; next_y = y1; dist = obstacles[x-1][y];
  }
  x1 = x+1; y1 = y;
  var ran = Math.random();
  if(x1>0 && x1<settings.width && y1>0 && y1<settings.height &&
      obstacles[x1][y1]>= 0 && dist >= obstacles[x+1][y] && ran<0.5){
      next_x = x+1; next_y = y; dist = obstacles[x+1][y];
  }
  x1 = x; y1 = y-1;
  if(x1>0 && x1<settings.width && y1>0 && y1<settings.height &&
      obstacles[x1][y1]>=0 && dist > obstacles[x][y-1]){
      next_x = x; next_y = y-1; dist = obstacles[x][y-1];
  }
  x1 = x; y1 = y+1;
  if(x1>0 && x1<settings.width && y1>0 && y1<settings.height &&
      obstacles[x1][y1]>=0 && dist >= obstacles[x][y+1]){
      next_x = x; next_y = y+1; dist = obstacles[x][y+1];
  }
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
    y: y*settings.tileheight
  }
}
