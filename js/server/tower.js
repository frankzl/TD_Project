
function getSquareR1(){
  return [{x:0,y:-1}, {x:0,y: 1},
  {x:1,y:0}, {x:-1,y:0},{x:-1,y:-1},{x:1,y:-1},{x:1,y:1},{x:-1,y:1}];
}

function getCrossPoints(range){
  return [{x:0,y:-1*range}, {x:-1*range, y:0}, {x:range, y:0}, {x:0, y:range}];
}

function combineRange(r1_dst, r2){
  Array.prototype.push.apply(r1_dst, r2);
  return r1_dst;
}
var monster_map;
var monsters;

exports.create = function(tower, map, monst){
  if(monster_map == undefined) {
    monster_map = map;
    monsters = monst;
  }
  this.position = tower.position;
  this.range = 10;
  this.inRange = function(position){
    var dx = (this.position.x-position.x);
    var dy = (this.position.y-position.y);
    return Math.sqrt(dx*dx+dy*dy) <= this.range;
  }
  this.target = undefined;
  this.speed = 20;

  this.reloadTimer = 0;
  this.counter = 0;

  this.acquireTarget = function(){
    target = undefined;
    if(target != undefined && target.position.x != -1){
      return target;
    }else{
      for(x=this.position.x-this.range; x < this.position.x+this.range; x++){
        for(y=this.position.y-this.range; y < this.position.y+this.range; y++){
          if( x >= 0 && x < monster_map.length && y>=0 && y<monster_map.length){
            var monster_index = monster_map[x][y];
            if(monster_index != -1 && monster_index != undefined){
              if(this.inRange(monsters[monster_index].position)){
                console.log("can shoot");
                target = monsters[monster_index];
              }
            }
          }
        }
      }
    }
    return target != undefined;
  }

  this.generateBullet = function(){
    if(this.counter <= 0){
      this.counter = this.reloadTimer;
    }else{
      this.counter --;
      return null;
    }
    if (target != undefined){
      return {
        position: this.position,
        velocity: this.speed,
        target: {x: target.position.x, y:target.position.y}
      }
    }
    return null;
  }

}

exports.toJSON = function(){
  return {position: {x:this.position.x, y:this.position.y}}
}
