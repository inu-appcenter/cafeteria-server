// TODO static으로 server.js에서 호스팅해주기. -민재

var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);

app.set('port', 8081);

//서버 가동
server.listen(app.get('port'), function(){

	console.log('connected on port '+ app.get('port'));
});

app.get('/', function(req,res,next){
  res.send('suc');
})

// 이미지파일 호스팅 로직
app.get('/photo',function (req,res){
    var filename = req.query.name;
    console.log(__dirname+'/data/photo/'+filename);
    fs.exists(__dirname+'/data/photo/'+filename+'.jpg', function (exists) {
        if (exists) {
            fs.readFile(__dirname+'/data/photo/'+filename + '.jpg', function (err,data){
                res.end(data);
            });
        } else {
            res.end('file is not exists');
        }
    })
});

app.get('/notice',function (req,res){
    // var filename = req.query.name;
    console.log(__dirname+'/data/server_message.json');
    fs.exists(__dirname+'/data/server_message.json', function (exists) {
        if (exists) {
            fs.readFile('./data/server_message.json', 'utf8',function (err,data){
                res.end(data);
            });
        } else {
            res.end('file is not exists');
        }
    })
});
