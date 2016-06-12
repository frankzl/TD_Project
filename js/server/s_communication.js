/**
 * Created by frankz on 11.06.16.
 */

exports.communication = function(io){
    game = require('./s_game')
    game.initGame('../../assets/tilemaps/maps/super_mario.json', io);
    io.on('connection', function(socket){
        console.log('user connected');

        socket.on('ready', function(s){
          io.emit('spawn_new', {
            position: {x:7, y:0},
            direction: {x: 0, y:1},
            velocity: 1
          });
          io.emit('tower_list', JSON.stringify(game.getTowerList()));
        })

        socket.on('tower_request_build', function(tower){
          console.log("allowed new tower");
          game.buildTower(tower);
          game.spawnMonster(5, 5, 0, 1, 1);
        })
    });
}
