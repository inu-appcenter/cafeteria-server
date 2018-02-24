// copyright(c) 2016 All rights reserved by jongwook(koyu1212@naver.com) 201003051 컴퓨터공학부 고종욱
// edited by jaemoon 201201646 정보통신공학과 신재문

var mysql = require('./mysql.js');
var moment = require('moment');
var request = require('request');
var asc = require('async');
var moment = require('moment');
var randtoken = require('rand-token');
// var winston = require('winston');
var path = require('path');
var mysqld = require('mysql');
var dbconfig = require('../config.js').MYSQL_CONFIG;
var pool = mysqld.createPool(dbconfig);
var fs = require('fs');
// require('date-utils');

// var logger = new (winston.Logger)({
// 	transports:[
// 		new (winston.transports.Console)({
// 			name:'consoleLog',
// 			colorize:false,
// 			timestamp: function(){return new Date().toFormat('YYYY-MM-DD HH24:MI:SS')},
// 			json:false
// 		}),
//
// 		new (winston.transports.File)({
// 			name:'infoLog',
// 			level:'info',
// 			filename:'./data/log/info.log',
// 			maxsize:10000000,
// 			maxFile:10,
// 			timestamp: function(){return new Date().toFormat('YYYY-MM-DD HH24:MI:SS')},
// 			dataPattern:'yyyyMMdd',
// 			json:false
// 		}),
// 		new (winston.transports.File)({
// 			name:'errorLog',
// 			level:'error',
// 			filename:'./data/log/err.log',
// 			maxsize:10000000,
// 			maxFile:10,
// 			timestamp: function(){return new Date().toFormat('YYYY-MM-DD HH24:MI:SS')},
// 			dataPattern:'yyyyMMdd',
// 			json:false
// 		})
// 	]
// });


// 200 : 성공
// 400 : ID/PW틀리거나 대상자 아님
// 401 : 토큰 없음(타 기기 로그인으로 자동로그인 풀림)
// 402 : 서버 DB에러
// 403 : 기타 에러

function login(req, res) {
	var sno = req.body.sno;
	var pw = req.body.pw;
	var device = req.body.device;
	var autologin = req.body.auto;
	var token = req.body.token;
	var barcode;

	// 토큰 자동로그인
	if(token){
		pool.getConnection(function(err, connection){
			if(err){
				res.sendStatus(402);
			}
			var query = connection.query('select student_no from autologin where token=\''+token + '\'', function(err, rows, fields){
				if(!err){
					if(rows.length != 0){
						// 자동로그인 성공
						sno = rows[0].student_no;
						if(sno.length == 10){
							barcode = (sno*4).toString();
						}else{
							barcode = (sno*6).toString();
						}
						console.log('[etc/login/token] ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + sno + ' SUCCESS');
						res.status(200).json({
							"barcode":barcode,
							"token":token
						});
					}
					else{
						// 토큰 없음, 재로그인 유도
						console.log('[etc/login/token/query] ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + token + ' TOKEN_ERROR');
						res.sendStatus(401);
					}
				}
				else{
					// DB 에러
					console.log('[etc/login/token/getConnection] ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + token + ' QUERY_ERROR');
					res.sendStatus(402);
				}
			});
			connection.release();
		});
	} // 토큰 자동로그인 끝

	// 로그인
	else if(sno){
		// 조식 대상자 확인
		const options = {
			method : 'POST',
			uri : 'http://inucafeteria.us.to:8081/login',
			form: {sno:sno, pw:pw}
		}
		// console.log('[login] sno : ' + sno + 'pw : ' + pw);

		request(options,
			function (error, response, body){
				if (!error) {
					// console.log('[login/request] body : ' + body);
					if(body=="Y"){
						if(sno.length == 10){
							barcode = (sno*4).toString();
						}else{
							barcode = (sno*6).toString();
						}
						mysql.checkBarcode(barcode);

						if(autologin == '1'){
							do{	// 자동로그인 토큰 중복 방지
								token = randtoken.generate(20);
							}while(mysql.checkTokenDup(token))

							pool.getConnection(function(err, connection){
								if(err){
									res.sendStatus(402);
								}
								var query = connection.query('select student_no from autologin where student_no=\''+sno + '\'' , function(err, rows, fields){
									if(!err){
										// 토큰이 있는 경우 삭제후 등록(새 기기에서로그인)
										// TODO releaseAutoLoginBySno를 setAutoLogin내에서 사용하도록.
										if(rows.length != 0){
											mysql.releaseAutoLoginBySno(sno);
											mysql.setAutoLogin(token, sno, device);
										}
										else{
											mysql.setAutoLogin(token, sno, device);
										}
									}
									else{
										console.log('err');
										res.sendStatus(401);
									}
								});
								connection.release();
							});
						} //자동로그인 등록 끝
						else {
							// 자동로그인 체크 안한경우.
						}
						console.log('[etc/login] ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + sno + ' SUCCESS');
						res.status(200).json({
							"token":token,
							"barcode":barcode
						});
					}
				}
				else {
					res.sendStatus(403);
				}
			}
		); // request end
	}
	else {
		res.sendStatus(400);
	}
}

function logout(req, res){
	var token = req.body.token
	if(token){
		console.log('[etc/logout]' + token + '로그아웃');
		mysql.releaseAutoLogin(token);
		req.session.destroy();
		res.json({"result":"logout is successful"});
	}
	else {
		res.json({"result":"invalid token"});
	}
}

function activeBarcode(req, res, next){
	var activated = req.body.activated;
	var barcode = req.body.barcode;
	if(!activated || !barcode){
		res.status(400).json({"result":"ERROR"});
		return;
	}
	mysql.activateBarcode(activated,barcode);
	res.status(200).json({"active":activated});
	console.log('[etc/activeBarcode] ' + barcode + ' is ' + activated);
}

// code 1: 기숙사 식당, 2 : 미추홀캠퍼스
function isBarcode(req,res){
	var barcode = req.query.barcode;
	var code = req.query.code;
	if(!barcode || !code){
		return res.status(400).json({ message : "Parameter_Error"});
	}
	// TODO 시간에따라 할인을 구분한다.
	// if() 할인 시간대에 하나도 해당안하면 리턴
	//momnet
	pool.getConnection(function(err, connection){
		if(err){
			console.log('[etc/isBarcode] DB_Connection_Error');
			connection.release();
			res.status(404).json({ message : "DB_ERROR"});
		}
		var query = connection.query('select * from barcode where barcode=\'' + barcode + '\'' , function(err, rows, fields){
			if(!err){
				if(rows.length != 0){
					var activated = rows[0].activated;
					var processing = rows[0].processing;
					var michuhol = rows[0].michuhol;
					var michuhol = rows[0].michuhol2;
					var dormitory = rows[0].dormitory;
					console.log('[etc/isBarcode] barcode checked : ' + barcode + ' code : ' + code + ' processing : ' + processing + ' activated : ' + activated + ' dormitory : ' +dormitory + ' michuhol : ' + michuhol);
					if(processing == 0 && activated == 1){
						if(code == '1'){
							// TODO 오전 시간인경우
							if(dormitory < 1){
								// 정상
								connection.query('update barcode set processing=\'1\' where barcode=\'' + barcode + '\'' , function(err, results){
									if(!err){
										console.log('[etc/isBarcode] 할인 대상');
										// console.log('[code/isBarcode] code : '+code);
										// logger.info(barcode/6 + ' 조식할인');
										// TODO 조회 카운트를 누적해 로그로 남기기.
										// console.log('[etc/isBarcode] ' + barcode/6 + '님이 조식할인을 받으셨습니다.');
									}
									else {
										console.log('[etc/isBarcode] Query_Error' + err);
										connection.release();
										return res.status(404).json({ message : 'DB_QUERY_ERROR'});
									}
								});
							}
							else {
								activated = 0;
							}
						}
						else if(code == '2'){
							// TODO 점심시간인경우
							if(michuhol < 2){
								// 정상
								connection.query('update barcode set processing=\'2\' where barcode=\'' + barcode + '\'' , function(err, results){
									if(!err){
										console.log('[etc/isBarcode] 할인 대상');
										// console.log('[code/isBarcode] code : '+code);
										// logger.info(barcode/6 + ' 조식할인');
										// TODO 조회 카운트를 누적해 로그로 남기기.
										// console.log('[etc/isBarcode] ' + barcode/6 + '님이 조식할인을 받으셨습니다.');
									}
									else {
										console.log('[etc/isBarcode] Query_Error' + err);
										connection.release();
										return res.status(404).json({ message : 'DB_QUERY_ERROR'});
									}
								});
							}
							// TODO 저녁시간인경우
							// else if(michuhol2 < 1){
								//
							// }
							else {
								// 횟수 초과
								activated = 0;
							}
						}
					}
					else if(activated == 0){
						console.log('[etc/isBarcode] Barcode Not Activated ' + barcode);
					}
					else {
						activated = 0;
						console.log('[etc/isBarcode] Barcode Not Processiong ' + barcode);
						// logger.info(barcode/6 + ' 불법적인 경로');
						// console.log('[etc/isBarcode] ' + barcode/6 + '님이 불법적인 경로로 할인시도를 하였습니다.');
					}
					return res.status(200).json({message : "SUCCESS","activated":activated});
				}
				else{
					console.log('[etc/isBarcode] Barcode_Not_Found : ' + barcode);
					// connection.release();
					return res.status(400).json({ message : 'BARCODE_ERROR'});
				}
			}
			else{
				console.log('[etc/isBarcode] Query_Error' + err);
				connection.release();
				return res.status(404).json({ message : 'DB_QUERY_ERROR'});
			}
		});
		connection.release();
	});
}

function paymentSend(req, res){
	var barcode = req.query.barcode;
	var payment = req.query.payment;
	pool.getConnection(function(err, connection){
		if(err){
			console.log('[etc/paymentSend] DB_Connection_Error' + err);
			res.status(404).json({ message : "DB_ERROR"});
		}
		var query = connection.query('select * from barcode where barcode=\'' + barcode + '\'' , function(err, rows, fields){
			if(rows.length != 0){
				if(!err){
					var processing = rows[0].processing;
					var michuhol = rows[0].michuhol;
					var dormitory = rows[0].dormitory;
					if(processing == 0){
						console.log('[etc/paymentSend] Barcode_State_Error. Barcode : ' + barcode + ', payment : ' + payment + ', processing : ' + processing);
						return res.status(400).json({ message : 'BARCODE_STATE_ERROR'});
					}
					if(payment == 'Y'){
						if(processing == '1'){
							dormitory++;
						}
						else if(processing == '2'){
							michuhol++;
						}

						console.log('[etc/paymentSend] dormitory : ' + dormitory + ', michuhol : ' + michuhol);
					}
					else if(payment == 'N'){
						// 그냥 processing만 0으로 초기화
					}
					var query = connection.query('update barcode set? where barcode=\'' + barcode + '\'',{processing:0, dormitory:dormitory, michuhol:michuhol} , function(err, rows, fields){
						if(!err){
							console.log('[etc/paymentSend] barcode : ' + barcode + ', payment : ' + payment);
							return res.status(200).json({message : "SUCCESS"});
						}
						else {
							console.log('[etc/paymentSend] Query_Error' + err);
							res.status(404).json({ message : "DB_QUERY_ERROR"});
						}
					});
				}
				else {
					if(err){
						console.log('[etc/paymentSend] Query_Error' + err);
						res.status(404).json({ message : "DB_QUERY_ERROR"});
					}
				}
			}
			else {
				console.log('[etc/paymentSend] Barcode_Error. Barcode : ' + barcode);
				return res.status(400).json({ message : 'BARCODE_ERROR'});
			}
		});
	});
}

function postErrorMessage(req, res){
	var sno = req.body.sno;
	var msg = req.body.msg;
	var device = req.body.device;

	console.log('error_msg is registered');

	mysql.putError(sno,msg,device);
	res.json({"result":"success"});
}

function getErrorMessage(req, res){
	var task = [
		function(callback){
			mysql.getError(callback);
		}
	];

	asc.series(task, function(err, results){
		// console.log(results);
		res.send(results[0]);
	})
}

function makeDate(millis){
	var now = new Date(millis);
	var year = now.getFullYear();
	var month = now.getMonth()+1;
	var day = now.getDate();
	if(month<10){
		month = '0'+month;
	}
	if(day<10) {
		day = '0'+day;
	}
	var date = ''+year+month+day;
	return date;
}

module.exports.login = login;
module.exports.logout = logout;
module.exports.activeBarcode = activeBarcode;
module.exports.isBarcode = isBarcode;
module.exports.paymentSend = paymentSend;
module.exports.postErrorMessage = postErrorMessage;
module.exports.getErrorMessage = getErrorMessage;
