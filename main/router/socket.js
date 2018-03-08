const util = require('util');
const moment = require('moment');
const logger = require('./logger.js');

var socketList = [];
var io;
function emit(req, res){
  var code = req.query.code;
  var num = req.query.num;
  // io.sockets.emit(code, {msg:num});
  for(var i in socketList){
    socketList[i].emit(code, {msg:num});
  }
  // console.log('[socket/emit]' + code + ' ' + num);
  res.send(code + ' ' + num);
}

function create (server){
  io = require('socket.io')(server);

  io.on('connection', function(socket){
    socketList.push(socket);
    var address = socket.handshake.address;
    address = address.substring(7);
    logger('info', util.format('ip : %s id : %s... connected, total : %s', address, socket.id.substring(0,8), socketList.length));
    // console.log('[socket] ip : ' + address + ' id : ' + socket.id.substring(0,8) + '... connected, total : ' + socketList.length);

    socket.on('reconnect', function(){
      console.log('[socket] ' + socket.id + ' has reconnected');
    });

    socket.on('disconnect', function(){
      socketList.splice(socketList.indexOf(socket),1);
          logger('info', util.format('ip : %s id : %s... disconnected, total : %s', address, socket.id.substring(0,8), socketList.length));
      // console.log(util.format('[%s][socket] ip : %s id : %s... disconnected, total : %s',moment().format('HH:mm:ss'), address, socket.id.substring(0,8), socketList.length));
    });
  }); // io.on
  return io;
}

module.exports.create = create;
module.exports.emit = emit;
