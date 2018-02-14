// copyright(c) 2017 All rights reserved by jaemoon(jjaemny@naver.com) 201201646 정보통신공학과 신재문


var express = require('express');
var oracledb = require('oracledb');

var bodyParser = require('body-parser');
var morgan = require('morgan');
var http = require('http');
var path = require('path');
var cluster = require('express-cluster');
var wookora = require('wookora');
var session = require('express-session');
var moment = require('moment');
var fs = require('fs');
var path = require('path');
var rfs = require('rotating-file-stream');

var oracledbconfig = require('./info/oracledbconfig.js');
var logDirectory = path.join(__dirname+'/data','log');

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

var accessLogStream = rfs('inuCafe.log',{
	interval : '7d',
	size : '10M',
	path : logDirectory
})

morgan.token('ktime',function() {
	now = new Date();
	year = now.getFullYear();
	month = now.getMonth()+1;
	if(month<10){
		month = '0'+month;
	}
	date=now.getDate();
	if(date<10) {
		date = '0'+date;
	}
	hour=now.getHours();
	if(hour<10){
		hour = '0'+hour;
	}
	min = now.getMinutes();
	if(min<10) {
		min = '0'+min;
	}
	sec = now.getSeconds();
	if(sec<10) {
		sec = '0'+sec;
	}
	return year+'-'+month+'-'+date+' '+hour+':'+min+':'+sec;
})

morgan.token('device',function(req,res) {
	return req.session.device;
});

morgan.token('user',function(req,res) {
	return req.session.user;
})

var auth = function(req, res, next) {
	if (req.session && req.session.status)
		return next();
	else
		return res.sendStatus(404);
		//return res.send("{status:\"notauth\"}");
};

var number = require('./router/number.js')
	,etc = require('./router/etc.js'),
	student = require('./router/student.js'),
	provider = require('./router/provider.js');

cluster(function(worker) {
	var app = express();
	var port = 3829;

	app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
	app.use(express.static(__dirname+'/data'));
	app.use(morgan(":ktime -" + worker.id+ "호 IP:remote-addr|:method:url 결과:status 응답시간 :response-time ms 기기 :device 사용자 :user",
					{skip:function(req,res){ return req.url === '/activeBarcode' || req.url === '/logout' || req.url === '/message'}, stream:accessLogStream}));
	app.use(session({
	key: 'jaemoon_session',
	secret: '01@0-~2#$36%4-5@00!8%',
	// store: sqlSessionStore,
	// resave: true,
	// saveUninitialized: false
}));
	app.post('/logout',  etc.logout);


	app.post('/registerNumber',number.registerNumber);
	app.post('/pushNumber', number.pushNumber);
	app.post('/postlogin',
						student.getstudentinfo,
						etc.postlogin,
						etc.Kpostlogin
					);
	app.post('/autologin',
						student.getstudentinfo,
	 					etc.autologin
					);
	app.post('/activeBarcode', etc.activeBarcode);
	app.get('/isBarcode', etc.isBarcode);
	app.post('/isBarcode', etc.postIsBarcode);
	app.post('/isNumberWait', etc.isNumberWait);
	app.post('/resetNumber', number.resetNumber);
	app.get('/getcode',number.getCode);
	app.post('/errormsg',etc.errMsg);
	app.post('/version',provider.version);
	app.get('/getInquire',provider.inquiredMsg);

	wookora.createPool(oracledbconfig, function(err, pool) {
	   // !! The pool ,was created is provided in the callback function ;)
	   if (err) throw err;
	   app.listen(port, function() {
	   console.log('INU_Cafeteria node oracle cluster server ' + worker.id +' 호기 작동' );
	   });
	});

},
{count: 4})
