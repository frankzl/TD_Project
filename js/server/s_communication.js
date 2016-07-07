/**
 * Created by frankz on 11.06.16.
 */
var game;
exports.communication = function(io){
    game = require('./s_game')
    game.initGame('../../assets/tilemaps/maps/super_mario.json', io);
    io.on('connection', function(socket){
        console.log('user connected');
        var ready = false;

        setInterval(function(){
          if(!ready){return;}
          var monsters = game.getMonsterList();
          if(monsters!=null){
            socket.emit('monster_update', monsters);
          }
        }, 1000)

        setInterval(function(){
          if(!ready){return;}
          game.update_bullets();
          var bullets = game.getBulletList();
          if(bullets != null){
            socket.emit('bullet_update', bullets);
          }
        }, 60)

        socket.on('ready', function(){
          ready = true;
          console.log('received ready');
          socket.emit('spawn_new', {
            position: {x:7, y:0},
            direction: {x: 0, y:1},
            velocity: 1
          });
          socket.emit('tower_list', JSON.stringify(game.getTowerList()));
          //console.log(JSON.stringify(game.getMonsterList()));
          //socket.emit('monster_list', JSON.stringify(game.getMonsterList()));
          game.getTowerList();
        })

        socket.on('tower_request_build', function(tower){
          console.log("allowed new tower");
          game.buildTower(tower);
          game.spawnMonster(5, 5, 0, 1, 1);
        })
    });
}
