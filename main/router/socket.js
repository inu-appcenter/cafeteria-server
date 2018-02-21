var express = require('express');
var http = require('http');
var path = require('path');
var request = require('request');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

var lists = new Array();

var httpServer = http.createServer(app).listen(3000, function(req, res){
	console.log('Socket IO Server has been started');
})

var io = require('socket.io').listen(httpServer);

app.get('/', function(req,res,next){
	for(x in lists) {
		socket = lists[x];
		if(req.query.code == '1'){
			// console.log('num : ' + req.query.num);
			socket.emit('1', {msg:req.query.num});
		}
		if(req.query.code == 2){
			socket.emit('2', {msg:req.query.num});
		}
		if(req.query.code == 3){
			socket.emit('3', {msg:req.query.num});
		}
		if(req.query.code == 4){
			socket.emit('4', {msg:req.query.num});
		}
		if(req.query.code == 5){
			socket.emit('5', {msg:req.query.num});
		}
		if(req.query.code == 6){
			socket.emit('6', {msg:req.query.num});
		}
		if(req.query.code == 7){
			socket.emit('7', {msg:req.query.num});
		}
	}
});



io.on('connection', function(socket){
	lists.push(socket);
	console.log('[socket] ' + socket.id + ' is connected, ' + lists.length + ' is logined');

	socket.on('reconnect', function(){
		console.log('[socket] ' + socket.id + ' has reconnected');
	})

	socket.on('disconnect', function(){
		lists.splice(lists.indexOf(socket),1);
		console.log('[socket] ' + socket.id + ' has disconnected, ' + lists.length + ' is logined');
	});
});
