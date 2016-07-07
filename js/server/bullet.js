
function getDirection(center, target){
  var dir = { x: (target.x-center.x),
                    y: (target.y-center.y)}
  var length = Math.sqrt(dir.x*dir.x+dir.y*dir.y);
  dir.x /= length;
  dir.y /= length;
  return dir;
}

exports.create = function(bullet){
  this.position = bullet.position;
  this.velocity = bullet.velocity;
  this.direction = getDirection(this.position, bullet.target);
  this.fly = function (){
    this.position.x += this.direction.x*this.velocity;
    this.position.y += this.direction.y*this.velocity;
  }
}
