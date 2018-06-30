/* copyright(c) 2017 All rights reserved by jaemoon(jjaemny@naver.com) 201201646 정보통신공학과 신재문
*
*/

const express = require('express');
const login = require('./login.js');
const config = require('./config.js');
const cluster = require('express-cluster');
const bodyParser = require('body-parser');
const dbConfig = config.DB_CONFIG;
const port = config.PORT;

cluster(function(worker) {
	console.log("카페테리아 로그인 " + worker.id + '실행 시작');
	var app = express();
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	app.post('/login', login.postlogin);
	app.use(function(req, res, next){
		let ip= req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress || 'IP Not Found';
		res.status(404).json({message : "경고 : 비정상 접근"});
	});

	app.listen(port);
},
{count: 4});
