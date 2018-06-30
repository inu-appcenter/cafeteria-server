// copyright(c) 2016 All rights reserved by jongwook(koyu1212@naver.com) 201003051 컴퓨터공학부 고종욱
// edited by jaemoon 201201646 정보통신공학과 신재문

const mysql = require('./mysql.js');
const moment = require('moment');
const request = require('request');
const asc = require('async');
const randtoken = require('rand-token');
// var winston = require('winston');
const path = require('path');
const mysqld = require('mysql');
const config = require('../config.js');
const dbconfig = config.MYSQL_CONFIG;
const pool = mysqld.createPool(dbconfig);
const fs = require('fs');
const logger = require('./logger.js');
const crypto = require('crypto');

function barcodeAdd(req, res){
	var barcode = req.query.barcode;

	pool.getConnection(function(err, connection){
		if(err){
			logger('error',err, barcodeAdd);
			res.status(404).json({ message : 'CONNECTION_ERROR'});
		}
		else{
			connection.query('insert into barcode set?',{"barcode":barcode}, function(err, results){
				connection.release();
				if(err){
					if(err.code == 'ER_DUP_ENTRY') {
						logger('info','바코드 기등록됨 : '+barcode, barcodeAdd);
						// console.log('구서버 바코드 이미 등록됨 : ' + barcode);
						res.status(200).json({ message : 'SUCCESS'});
					}
					else {
						logger('info','바코드 등록실패 : '+barcode, barcodeAdd);
						// console.log('구서버 바코드 등록 실패 : ' + barcode);
						res.status(200).json({ message : 'ETC_ERROR'});
					}
				} else{
					logger('info','바코드 등록성공 : '+barcode, barcodeAdd);
					res.status(200).json({ message : 'SUCCESS'});
				}
			});
		}
	});
}

// 200 : 성공
// 400 : ID/PW틀리거나 대상자 아님
// 401 : 토큰 없음(타 기기 로그인으로 자동로그인 풀림)
// 402 : 서버 DB에러
// 403 : 기타 에러

function login(req, res) {
	let sno = req.body.sno;
	let pw = req.body.pw;
	let device = req.body.device;
	let autologin = req.body.auto;
	let token = req.body.token;
	let barcode;

	// 토큰 자동로그인
	if(token){
		pool.getConnection(function(err, connection){
			if(err){
				logger('error',err, login);
				res.sendStatus(402);
			}
			let query = connection.query('select student_no from autologin where token=\''+token + '\'', function(err, rows, fields){
				if(!err){
					if(rows.length != 0){
						// 자동로그인 성공
						sno = rows[0].student_no;
						if(sno.length == 10){
							barcode = (sno*4).toString();
						}else{
							barcode = (sno*6).toString();
						}
						logger('info', sno + ' Token Login SUCCESS');
						res.status(200).json({
							"barcode":barcode,
							"token":token
						});
					}
					else{
						// 토큰 없음, 재로그인 유도
						logger('info', token + ' TOKEN_ERROR', login);
						res.sendStatus(401);
					}
				}
				else{
					// DB 에러
					logger('error', token + err, login);
					res.sendStatus(402);
				}
			});
			connection.release();
		});
	} // 토큰 자동로그인 끝

	// 로그인
	else if(sno){
		// 양방향 암호화
		let cipher = crypto.createCipher('aes-256-cbc', config.PASSWORD);
		let encypt = cipher.update(pw, 'utf-8', 'base64');
		encypt += cipher.final('base64');
		pw = encypt;
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
										logger('error',err,login);
										res.sendStatus(401);
									}
								});
								connection.release();
							});
						} //자동로그인 등록 끝
						else {
							// 자동로그인 체크 안한경우.
						}
						logger('info', sno + ' Login SUCCESS', login);
						res.status(200).json({
							"token":token,
							"barcode":barcode
						});
					}
					else if(body=='N'){
						logger('info', sno + ' login fail', login);
						return res.sendStatus(400);
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
		logger('info', token + ' 로그아웃', logout);
		mysql.releaseAutoLogin(token);
		res.json({"result":"logout is successful"});
	}
	else {
		logger('error', token + ' 로그아웃 토큰 없음', logout);
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
	var sno = barcode<2000000000 ? barcode/6 : barcode/4;
	logger('info', sno  + ' : ' + barcode + ' : ' + activated, activeBarcode);
}

// code 1: 기숙사 식당, 2 : 미추홀캠퍼스
function isBarcode(req,res){
	var barcode = req.query.barcode;
	var cafecode = req.query.code;
	var menu = req.query.menu;
	// if(!barcode || !cafecode || !menu){
	// return res.status(400).json({ message : "Parameter_Error"});
	// }
	// TODO 시간에따라 할인을 구분한다.
	// if() 할인 시간대에 하나도 해당안하면 리턴
	var time = getTimeSlot(60);

	//momnet
	pool.getConnection(function(err, connection){
		if(err){
			logger('error', err, isBarcode);
			connection.release();
			return res.status(404).json({ message : "DB_ERROR"});
		}
		var query = connection.query('select * from barcode where barcode=\'' + barcode + '\'' , function(err, rows, fields){
			// connection.release();

			if(!err){
				if(rows.length != 0){
					logger('info', 'barcode checked : ' + barcode + ' code : ' + cafecode + ' menu : ' + menu, isBarcode);
					var activated = rows[0].activated;
					var lastchecktime = rows[0].lastchecktime;
					if(activated == 1){
						connection.query('select * from payment where barcode=? and cafecode=? and menu=? and time=?',[barcode, cafecode, menu, time], function (err, rows, fields){
							connection.release();
							if(!err){
								if(time == -1){
									logger('error', barcode +  ' 할인 시간대 아님.' + cafecode + ', ' + menu, isBarcode);
									return res.status(200).json({message : "SUCCESS","activated":0});
								}
								if(rows.length == 0){
									if((cafecode == 1 && time == 0) || (cafecode == 2 && (time == 1 || time == 2))){
										if(lastchecktime == null || moment().diff(moment(lastchecktime).format('YYYY-MM-DD HH:mm:ss'), 'seconds') > 15){
											logger('info', 'Discount OK : ' + barcode + ' code : ' + cafecode + ' menu : ' + menu, isBarcode);
											mysql.updateBarcodeCheckTime(barcode);
											return res.status(200).json({message : "SUCCESS","activated":1});
										}
										else {
											logger('info', barcode +  ' 15초이내 할인체크.' + cafecode + ', ' + menu, isBarcode);
											return res.status(200).json({message : "SUCCESS","activated":0});
										}
										// logger('info', 'Discount OK : ' + barcode + ' code : ' + cafecode + ' menu : ' + menu, isBarcode);
										// mysql.updateBarcodeCheckTime(barcode)
										// return res.status(200).json({message : "SUCCESS","activated":1});
									}
									else {
										logger('error', barcode +  ' 할인 시간대 아님.' + cafecode + ', ' + menu, isBarcode);
										return res.status(200).json({message : "SUCCESS","activated":0});
									}
								}
								else {
									logger('info', 'Already_Discounted : ' + barcode + ' code : ' + cafecode + ' menu : ' + menu, isBarcode);
									return res.status(200).json({message : "SUCCESS","activated":0});
								}
							}
							else {
								logger('error', barcode + ' code : ' + cafecode + ' menu : ' + menu + err, isBarcode);
								return res.status(200).json({ message : "DB_ERROR"});
							}
						});
					}
					else {
						logger('info', 'Barcode Not Activated ' + barcode, isBarcode);
						return res.status(200).json({message : "SUCCESS","activated":0});
					}
				}
				else{
					// // 구 서버 지연때문에 등록되지 않은 바코드들을 위해 조건만 맞으면 추가시켜줌.
					// //console.log(barcode*1 >= 1000000000 && ((barcode*1/6)%1 === 0 || (barcode*1/4)%1 === 0));
					// if(((barcode*1 >= 1000000000) && ((((barcode*1)/6)%1) === 0)) || ((barcode*1 >= 8000000000) && ((((barcode*1)/4)%1) === 0))){
					// 	mysql.checkBarcode(barcode);
					// 	logger('info', 'Tmp Barcode Accecpt ' + barcode, isBarcode);
					// 	if((cafecode == 1 && time == 0) || (cafecode == 2 && (time == 2 || time == 3))){
					// 		logger('info', 'Discount OK : ' + barcode + ' code : ' + cafecode + ' menu : ' + menu, isBarcode);
					// 		return res.status(200).json({message : "SUCCESS","activated":1});
					// 	}
					// 	else {
					// 		logger('error', barcode +  ' 할인 시간대 아님.' + cafecode + ', ' + menu, isBarcode);
					// 		return res.status(200).json({message : "SUCCESS","activated":0});
					// 	}
					// }
					// else {
					logger('error', 'Barcode Not Found ' + barcode, isBarcode);
					return res.status(400).json({ message : 'BARCODE_ERROR'});
					// }
				}
			}
			else{
				logger('error', err , isBarcode);
				return res.status(404).json({ message : 'DB_QUERY_ERROR'});
			}
		});
	});
}

function paymentSend(req, res){
	var barcode = req.query.barcode;
	var cafecode = req.query.code;
	var menu = req.query.menu;
	var payment = req.query.payment;

	if(!barcode || !cafecode || !menu || !payment){
		logger('error-only', {barcode:barcode, cafecode:cafecode, menu:menu, payment:payment}, paymentSend);
		return res.status(400).json({ message : "Parameter_Error"});
	}
	var time = getTimeSlot(20);
	pool.getConnection(function(err, connection){
		if(err){
			logger('error', err, paymentSend);
			return res.status(404).json({ message : "DB_ERROR"});
		}

		if(payment == 'Y'){
			connection.query('insert into payment (barcode, cafecode, menu, time) values ('+barcode+','+cafecode+','+menu+','+time+')', function(err, result){
				// console.log(JSON.stringify(result) + ' ' + err.code);
				connection.release();
				if(!err){
					logger('info', '결제등록 성공. barcode : ' + barcode + ' cafecode : ' + cafecode + ' menu : ' + menu, paymentSend);
					return res.status(200).json({ message : 'SUCCESS'});
				}
				else if(err.code == 'ER_DUP_ENTRY') {
					logger('error', '중복 할인됨. barcode : ' + barcode + ' cafecode : ' + cafecode + ' menu : ' + menu, paymentSend);
					return res.status(200).json({ message : 'Already_Discounted'});
				}
				else {
					logger('error', '결제등록 실패. barcode : ' + barcode + ' cafecode : ' + cafecode + ' menu : ' + menu + err, paymentSend);
					return res.status(200).json({ message : 'SUCCESS'});
				}
			});
		}
		else {
			connection.query('delete from payment where barcode=? and cafecode=? and menu=? ', [barcode, cafecode, menu], function(err, result){
				// console.log(JSON.stringify(result) + ' ' + err);
				connection.release();
				if(!err){
					logger('info', '결제취소 성공. barcode : ' + barcode + ' cafecode : ' + cafecode + ' menu : ' + menu, paymentSend);
					return res.status(200).json({ message : 'SUCCESS'});
				}
				else {
					logger('error', '결제취소 실패. barcode : ' + barcode + ' cafecode : ' + cafecode + ' menu : ' + menu + err, paymentSend);
					return res.status(200).json({ message : 'ERROR'});
				}
			});
		}
	});
}

function postErrorMessage(req, res){
	var sno = req.body.sno;
	var title = req.body.title;
	var msg = req.body.msg;
	var device = req.body.device;
	var service = req.body.service;
	logger('info', '문의사항 '+service+' '+msg+' 등록됨', postErrorMessage);
	mysql.putError(sno, title, msg, device, service);
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
		json = JSON.parse(JSON.stringify(results[0]));
		res.send('<pre>' + JSON.stringify(json, null, '\t') + '</pre>');
	})
}

function getTimeSlot(spare){
	if(!spare) spare = 0;
	var breakfastStart = moment('07:00','HH:mm');
	var breakfastEnd = moment('09:40','HH:mm').add(spare, 'm');
	var launchStart = moment('10:30','HH:mm');
	var launchEnd = moment('14:10', 'HH:mm').add(spare, 'm');
	var dinnerStart = moment('16:30', 'HH:mm');
	var dinnerEnd = moment('18:40', 'HH:mm').add(spare, 'm');
	var now = moment();
	var time;
	if(now.isBetween(breakfastStart, breakfastEnd, 'minutes', '[]')){
		time = 0;
	}
	else if (now.isBetween(launchStart, launchEnd, 'minutes', '[]')) {
		time = 1;
	}
	else if (now.isBetween(dinnerStart, dinnerEnd, 'minutes', '[]')){
		time = 2;
	} else {
		time = -1;
	}
	return time;
}

module.exports.barcodeAdd = barcodeAdd;
module.exports.login = login;
module.exports.logout = logout;
module.exports.activeBarcode = activeBarcode;
module.exports.isBarcode = isBarcode;
module.exports.paymentSend = paymentSend;
module.exports.postErrorMessage = postErrorMessage;
module.exports.getErrorMessage = getErrorMessage;
