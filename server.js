//this is my server

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var p2 = require('p2');
var s_com = require('./js/server/s_communication');

app.use('/js/client', express.static(__dirname + '/js/client'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function(req, res){
      res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function () {
      console.log('listening on *:3000');
});

s_com.communication(io);
