/*
* copyright(c) 2017 All rights reserved by jaemoon(jjaemny@naver.com) 201201646 정보통신공학과 신재문
* 201301459 컴퓨터공학 손민재(bungabear6422@gmail.com)
*/
const cluster = require('cluster');
const config = require('./config.js');
const SESSION_KEY = config.SESSION_KEY;
const food = require('./router/food');
const socket = require('./router/socket.js');
const logger = require('./router/logger.js');
const schedule = require('node-schedule');
const express = require('express');
const session = require('express-session');
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

const port = 3829;

// const logDirectory = path.join(__dirname+'/public','log');

// var accessLogStream = rfs('inuCafe.log',{
// 	interval : '7d',
// 	size : '10M',
// 	path : logDirectory
// });

// 서버가 죽는걸 방지, 다중 처리.
if (cluster.isMaster) {
	// 식단 파싱 매일 7시 TODO 오래된 식단 삭제 하기.
	const bot = require('./router/telegrambot.js');
	schedule.scheduleJob('0 7 * * *', food.getFoodPlans);
	// Payment DB를 log/payment에 기록
	schedule.scheduleJob('42 22 * * *', logger.storePaymentHistory);
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

	var app = express();
	var server = http.createServer(app);
	var io = socket.create(server);

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(session(SESSION_KEY));
	app.use('/', express.static(__dirname + '/public'));
	app.use('/image', express.static(__dirname + '/public/image'));
	app.use('/js', express.static(__dirname + '/views/js'));
	app.use('/css', express.static(__dirname + '/views/css'));
	app.use('/logs', serveIndex(__dirname + '/public/log'));
	app.use('/logs', express.static(__dirname + '/public/log'));

	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(function(req, res, next){
		res.setTimeout(3*1000, function(){
			if(req.originalUrl == '/activeBarcode') {
				if(!res.headerSent) res.status(200).json({message : "SUCCESS", activated:0});
			}
			else {
				if(!res.headerSent) res.status(501).json({message : "Unknown_Error"});
			}
			logger('error', 'response time out : ' + req.originalUrl + '\n' + JSON.stringify(req.body || '', null, ' '));
			process.exit();
		});
		next();
	});

	app.get('/favicon.ico', (req, res) => res.sendStatus(204));

	app.post('/login', etc.login);
	app.post('/logout',  etc.logout);
	app.post('/activeBarcode', etc.activeBarcode);
	app.get('/barcodeAdd', etc.barcodeAdd);
	app.get('/isBarcode', etc.isBarcode);
	app.get('/paymentSend', etc.paymentSend);

	app.get('/ads', (req, res) => {res.render('ads');});
	app.get('/store', (req, res) => {res.render('store');});

	app.get('/food/:date/:type', food.food);
	app.get('/food/:date', food.food);
	// Android, iOS 식단 path 분리했으나, foodplan으로 통합예정
	app.get('/foodplan/:date', food.food);
	app.post('/adSet', ad.upload().single('userfile'), ad.adSet);

	app.get('/socket', socket.emit);
	app.post('/isNumberWait', number.isNumberWait);
	app.post('/registerNumber',number.registerNumber);
	app.get('/pushNumber', number.pushNumber);
	app.post('/resetNumber', number.resetNumber);

	app.post('/errormsg',etc.postErrorMessage);
	app.get('/errormsg', etc.getErrorMessage);
	app.get('/kill', function(req,res){
		let s = req.query.switch;
		if(s == config.KILL_SWITCH){
			res.send("kill cluster");
			process.exit();
		}
	});

	app.use(function(req, res, next){
		let ip= req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress || 'IP Not Found';
		if(!res.headerSent) res.status(501).json({message : "Unknown_Error"});
		logger('error-only', 'pathHandler : ' + req.originalUrl + '\n' + JSON.stringify(req.body || '', null, ' ') + ip + '\n' );
	});

	app.use(function(err, req, res, next){
		let ip= req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress || 'IP Not Found';

		if(req.originalUrl == '/activeBarcode') {
			if(!res.headerSent) res.status(200).json({message : "SUCCESS", activated:0});
		}
		else {
			if(!res.headerSent) res.status(501).json({message : "Unknown_Error"});
		}
		logger('error', 'errorHandler '+err.status+': ' + req.originalUrl + '\n' + JSON.stringify(req.body || '', null, ' ') + '\n' + err + ip);
		process.exit();
	});

	server.listen(port);
}
