// copyright(c) 2017 All rights reserved by jaemoon(jjaemny@naver.com) 201201646 정보통신공학과 신재문
const express = require('express');
const cluster = require('express-cluster');
const session = require('express-session');
const fs = require('fs');
const http = require('http');
const path = require('path');
const moment = require('moment');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');

const morgan = require('morgan');
const randtoken = require('rand-token');

const rfs = require('rotating-file-stream');
const etc = require('./router/etc.js');
const number = require('./router/number.js');
const socket = require('./router/socket.js');
const ad = require('./router/ad.js');
const food = require('./router/food');
const SESSION_KEY = require('./config.js').SESSION_KEY;
const logDirectory = path.join(__dirname+'/data','log');

// 식단 파싱 매일 7시
var dd = schedule.scheduleJob('* 7 * * *', food.getFoodPlans);

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

// 서버가 죽는걸 방지.
cluster(function(worker){
	var port = 3829;
	var app = express();
	var server = http.createServer(app);
	var io = socket.create(server);

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	app.use('/', express.static(__dirname + '/public'));
	app.use('/image', express.static(__dirname + '/public/image'));
	app.use('/js', express.static(__dirname + '/views/js'));
	app.use(session(SESSION_KEY));
	// app.use(morgan("IP:remote-addr|:method:url 결과:status 응답시간 :response-time ms 기기 :device 사용자 :user",
	// {skip:function(req,res){ return req.url === '/activeBarcode' || req.url === '/logout' || req.url === '/message'}, stream:accessLogStream}));

	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.get('/ads', (req, res) => {res.render('ads');});
	app.get('/food/:date', food.food);
	app.post('/adSet', ad.upload().single('userfile'), ad.adSet);

	app.post('/login', etc.login);
	app.post('/logout',  etc.logout);
	app.post('/activeBarcode', etc.activeBarcode);
	app.get('/isBarcode', etc.isBarcode);
	app.get('/paymentSend', etc.paymentSend);

	app.get('/socket', socket.emit);
	app.post('/isNumberWait', number.isNumberWait);
	app.post('/registerNumber',number.registerNumber);
	app.get('/pushNumber', number.pushNumber);
	app.post('/resetNumber', number.resetNumber);

	app.post('/errormsg',etc.postErrorMessage);
	app.get('/errormsg', etc.getErrorMessage);

	server.listen(port);
	console.log("서버 시작" + moment().format('YYYY-MM-DD HH:mm:ss'));
},
{count:1});
