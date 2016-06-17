
exports.create = function(monster){
  this.position = monster.position;
  this.direction = monster.direction;
  this.velocity = monster.velocity;

  this.move = function(step){
    monster.position.x += monster.direction.x*monster.velocity;
    monster.position.y += monster.direction.y*monster.velocity;
  }
  
  this.jump = function(x,y){
    monster.position.x = parseInt(x);
    monster.position.y = parseInt(y);
  }
  this.setHorizontalDir = function(){
    var ran = Math.random();
    console.log(ran)
    if(ran < 0.5){
      this.direction.x = 1;
      this.direction.y = 0;
    }else{
      this.direction.x = -1;
      this.direction.y = 0;
    }
  }
}
