
var socketList = [];
var io;
function emit(req, res){
  var code = req.query.code;
  var num = req.query.num;
  // io.sockets.emit(code, {msg:num});
  for(var i in socketList){
    socketList[i].emit(code, {msg:num});
  }
  console.log('[socket/emit]' + code + ' ' + num);
  res.send(code + ' ' + num);
}

function create (server){
  io = require('socket.io')(server);

  io.on('connection', function(socket){
    socketList.push(socket);
    console.log('[socket] ' + socket.id + ' is connected, total : ' + socketList.length);

    socket.on('reconnect', function(){
      console.log('[socket] ' + socket.id + ' has reconnected');
    });

    socket.on('disconnect', function(){
      socketList.splice(socketList.indexOf(socket),1);
      console.log('[socket] ' + socket.id + ' has disconnected, total : ' + socketList.length);
    });
  }); // io.on
  return io;
}

module.exports.create = create;
module.exports.emit = emit;
