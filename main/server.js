// copyright(c) 2017 All rights reserved by jaemoon(jjaemny@naver.com) 201201646 정보통신공학과 신재문

const cluster = require('cluster');
const SESSION_KEY = require('./config.js').SESSION_KEY;
const food = require('./router/food');
const socket = require('./router/socket.js');
const logger = require('./router/logger.js');
const schedule = require('node-schedule');

// const logDirectory = path.join(__dirname+'/public','log');

// schedule.scheduleJob('58 23 * * *', function(){
// });


// var accessLogStream = rfs('inuCafe.log',{
// 	interval : '7d',
// 	size : '10M',
// 	path : logDirectory
// });

// morgan.token('current_time', (req, res)=>(
// 	moment().format('YYYY-MM-DD HH:mm:ss')
// ));
// morgan.token('device', (req,res)=>(
// 	req.session.device
// ));
// morgan.token('sno', (req,res) => (
// 	req.session.device
// ));
// 서버가 죽는걸 방지, 다중 처리.
if (cluster.isMaster) {

	// 식단 파싱 매일 7시
	// TODO 오래된 식단 삭제 하기.
	// TODO DB 일별 초기화.
	const bot = require('./router/telegrambot.js');
	schedule.scheduleJob('0 7 * * *', food.getFoodPlans);
	// Payment DB를 log/payment에 기록하고 truncate
	schedule.scheduleJob('42 22 * * *', logger.storePaymentHistory);
	// std.log와 err.log를 /log 폴더에 복사해놓고 truncate
	// schedule.scheduleJob('50 23 * * *', logger.clearCurrentLog);
	for (var i = 0; i < 1; i++) {
		var child = cluster.fork();
		logger('info','worker '+child.process.pid+' born at init.');
	}
	cluster.on('exit', function(deadWorker, code, signal) {
		var worker = cluster.fork();
		var newPID = worker.process.pid;
		var oldPID = deadWorker.process.pid;
		logger('error','worker '+oldPID+' die, ' + newPID + 'born');
	});
} else {

	const express = require('express');
	// const session = require('express-session');
	const fs = require('fs');
	const http = require('http');
	const path = require('path');
	const moment = require('moment');
	const bodyParser = require('body-parser');
	const winston = require('winston');
	const morgan = require('morgan');
	const randtoken = require('rand-token');
	const serveIndex = require('serve-index');

	const mysql = require('./router/mysql.js');
	const rfs = require('rotating-file-stream');
	const etc = require('./router/etc.js');
	const number = require('./router/number.js');
	const ad = require('./router/ad.js');

	var port = 3829;
	var app = express();
	var server = http.createServer(app);
	var io = socket.create(server);

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	// app.use(session(SESSION_KEY));
	app.use('/', express.static(__dirname + '/public'));
	app.use('/image', express.static(__dirname + '/public/image'));
	app.use('/js', express.static(__dirname + '/views/js'));
	app.use('/css', express.static(__dirname + '/views/css'));
	app.use('/log', serveIndex(__dirname + '/log'));
	app.use('/log', express.static(__dirname + '/log'));
	app.use('/logs', serveIndex(__dirname + '/public/log'));
	app.use('/logs', express.static(__dirname + '/public/log'));

	// app.use(morgan('[:current_time] IP:remote-addr Method:method Status:status Respons-time :response-time ms'),
	// {skip:function (req,res){return req.url == '/activeBarcode' || '/socket' || '/errormsg' || '/food' || '/ads' || '/' || '/js'}, stream:accessLogStream});
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(function(req, res, next){
		res.setTimeout(3*1000, function(){
			logger('error', 'response time out : ' + req.originalUrl + '\n' + JSON.stringify(req.body || '', null, ' '));
			if(!res.headerSent) res.status(200).json({message : "SUCCESS", activated:0});
			process.exit();
		});
		next();
	});

	app.use(function(err, req, res, next){
		if(req.originalUrl == '/activeBarcode'){
			logger('error-only', 'errorHandler : ' + req.originalUrl + '\n' + JSON.stringify(req.body || '', null, ' ') + '\n' + err);
		}
		else {
			logger('error', 'errorHandler : ' + req.originalUrl + '\n' + JSON.stringify(req.body || '', null, ' ') + '\n' + err);
		}
		if(!res.headerSent) res.status(200).json({message : "SUCCESS", activated:0});
		process.exit();
	});

	// app.get('/std.log', (req, res) => {	// read all lines:
	// logger.readReverse('./std.text', (str)=>{res.send('<pre>위가 최신\n'+str+'</pre>')});
	// });
	// app.get('/err.log', (req, res) => {	// read all lines:
	// logger.readReverse('./err.text', (str)=>{res.send('<pre>위가 최신\n'+str+'</pre>')});
	// });

	app.get('/ads', (req, res) => {res.render('ads');});
	app.get('/store', (req, res) => {res.render('store');});
	app.get('/food/:date/:type', food.food);
	app.get('/food/:date', food.food);
	app.post('/adSet', ad.upload().single('userfile'), ad.adSet);

	app.get('/barcodeAdd', etc.barcodeAdd);
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
	app.get('/kill', function(req,res){
		res.send("kill cluster");
		process.exit();
	});

	server.listen(port);
	// 클라이언트가 응답을 받지않고 연결을 끊으면 서버가 2분간 대기하게 되므로, 적절히 짧은 시간을 주어야한다.
	// server.timeout = 2*1000;
}
