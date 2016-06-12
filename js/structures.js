
requestTower = function(){
  var point = translateToGameCoord(game.input.x, game.input.y);
  tower.position = point;
  sendJSON('tower_request_build', tower);
}

var tower = {
  position: {x: 0, y: 0},
  type: 0,
  sprite: null
}

var spawn = {
  position: {x: 0, y: 0},
  spawn_position: {x: 0, y: 0},
  sprite: null
}

var monster = {
  position: {x: 0, y: 0},
  direction: {x: 0, y: 0},
  velocity: 1,
  sprite: null
}
