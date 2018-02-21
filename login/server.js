// copyright(c) 2017 All rights reserved by jaemoon(jjaemny@naver.com) 201201646 정보통신공학과 신재문
/* 로그인 Refector 손민재.
	오라클 wrapper인 wookora안쓰고 그냥 오라클 사용함.
*/


var express = require('express');
var oracledb = require('oracledb');
var login = require('./login.js');

var cluster = require('express-cluster');
var oracledbconfig = require('./oracledbconfig.js');
var bodyParser = require('body-parser');



cluster(function(worker) {
	console.log(worker.id + '실행 시작');
	var app = express();
	var port = 8081;
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	app.post('/login', login.postlogin);
	app.listen(port);
},
{count: 4});

// Oracle 버전 확인 함수. 11.2.0.3
// app.get('/version', function(req,res){
// 	var sql = 'SELECT * FROM PRODUCT_COMPONENT_VERSION';
// 	wookora.execute(
// 		sql,{},{outFormat: wookora.OBJECT},
// 		function(err, results) {
// 			if (err) {
// 				console.log('error' + err);
// 				res.send(err);
// 				return;
// 			}
// 			// res.header("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
// 			res.send(results);
// 			console.log('success' + results);
// 		}
// 	);
// });
