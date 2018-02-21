// copyright(c) 2017 All rights reserved by jaemoon(jjaemny@naver.com) 201201646 정보통신공학과 신재문

var socket = require('./socket.js');
var express = require('express');
var ad = require('./router/ad.js');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var http = require('http');
var path = require('path');
var cluster = require('express-cluster');
var session = require('express-session');
var moment = require('moment');
var fs = require('fs');
var path = require('path');
var rfs = require('rotating-file-stream');
var number = require('./router/number.js');
var etc = require('./router/etc.js');
var randtoken = require('rand-token');
//var student = require('./router/student.js');
var provider = require('./router/provider.js');
var logDirectory = path.join(__dirname+'/data','log');
var multer = require('multer'); // multer모듈 적용 (for 파일업로드)

// fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
//
// var accessLogStream = rfs('inuCafe.log',{
// 	interval : '7d',
// 	size : '10M',
// 	path : logDirectory
// })
//
// morgan.token('ktime',function() {
// 	now = new Date();
// 	year = now.getFullYear();
// 	month = now.getMonth()+1;
// 	if(month<10){
// 		month = '0'+month;
// 	}
// 	date=now.getDate();
// 	if(date<10) {
// 		date = '0'+date;
// 	}
// 	hour=now.getHours();
// 	if(hour<10){
// 		hour = '0'+hour;
// 	}
// 	min = now.getMinutes();
// 	if(min<10) {
// 		min = '0'+min;
// 	}
// 	sec = now.getSeconds();
// 	if(sec<10) {
// 		sec = '0'+sec;
// 	}
// 	return year+'-'+month+'-'+date+' '+hour+':'+min+':'+sec;
// })
//
// morgan.token('device',function(req,res) {
// 	return req.session.device;
// });
//
// morgan.token('user',function(req,res) {
// 	return req.session.user;
// })
//
// var auth = function(req, res, next) {
// 	if (req.session && req.session.status)
// 		return next();
// 	else
// 		return res.sendStatus(404);
// 	//return res.send("{status:\"notauth\"}");
// };
cluster(function(worker){
	var port = 3829;
	var app = express();
	var server = http.createServer(app);
	var io = socket.create(server);

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	app.use('/', express.static(__dirname + '/public'));
	app.use('/menu', express.static(__dirname + '/public/menu'));
	app.use('/image', express.static(__dirname + '/public/image'));
	app.use('/js', express.static(__dirname + '/views/js'));
	// app.use(morgan("IP:remote-addr|:method:url 결과:status 응답시간 :response-time ms 기기 :device 사용자 :user",
	// {skip:function(req,res){ return req.url === '/activeBarcode' || req.url === '/logout' || req.url === '/message'}, stream:accessLogStream}));
	app.use(session({
		key: 'jaemoon_session',
		secret: '01@0-~2#$36%4-5@00!8%',
		// store: sqlSessionStore,
		resave: true,
		saveUninitialized: false
	}));


	var storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, 'public/image/'); // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
		},
		filename: function (req, file, cb) {
			// randtoken.generate(10);
			// TODO 파일 중복체크, 파일명 변경
			cb(null, new Date().valueOf() + path.extname(file.originalname)); // cb 콜백함수를 통해 전송된 파일 이름 설정
		}
	});
	var upload = multer({ storage: storage });

	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.get('/ads', function (req, res) {
		res.render('ads');
	});
	app.post('/adSet', upload.single('userfile'), ad.adSet);

	app.post('/login', etc.login);
	app.post('/isNumberWait', etc.isNumberWait);
	app.post('/logout',  etc.logout);
	app.post('/activeBarcode', etc.activeBarcode);
	app.get('/isBarcode', etc.isBarcode);
	app.get('/paymentSend', etc.paymentSend);

	app.get('/socket', socket.emit);
	app.post('/registerNumber',number.registerNumber);
	app.get('/pushNumber', number.pushNumber);
	app.post('/resetNumber', number.resetNumber);

	app.post('/errormsg',etc.postErrorMessage);
	app.get('/errormsg', etc.getErrorMessage);
	// app.get('/getInquire',provider.inquiredMsg);

	server.listen(port);
},
{count:1});
