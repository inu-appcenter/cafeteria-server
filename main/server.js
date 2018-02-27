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
const logDirectory = path.join(__dirname+'/public','log');

// 식단 파싱 매일 7시
var dd = schedule.scheduleJob('* * 7 * *', food.getFoodPlans);

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var accessLogStream = rfs('inuCafe.log',{
	interval : '7d',
	size : '10M',
	path : logDirectory
});

// morgan.token('current_time', (req, res)=>(
// 	moment().format('YYYY-MM-DD HH:mm:ss')
// ));
// morgan.token('device', (req,res)=>(
// 	req.session.device
// ));
// morgan.token('sno', (req,res) => (
// 	req.session.device
// ));

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
	// app.use(morgan('[:current_time] IP:remote-addr Method:method Status:status Respons-time :response-time ms'),
		// {skip:function (req,res){return req.url == '/activeBarcode' || '/socket' || '/errormsg' || '/food' || '/ads' || '/' || '/js'}, stream:accessLogStream});

	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.get('/ads', (req, res) => {res.render('ads');});
	app.get('/store', (req, res) => {res.render('store');});
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
{count:2});
