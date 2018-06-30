// copyright(c) 2017 All rights reserved by jaemoon(jjaemny@naver.com) 201201646 정보통신공학과 신재문

var express = require('express');
var morgan = require('morgan');
var asc = require('async');
var moment = require('moment');
// var http = require('http').Server(express);
// var io = require('socket.io')(http);
// var http = require('http');
var request = require('request');
const logger = require('./logger.js');


var FCM = require('fcm-node');

var fcm = new FCM(require('../config.js').FCM_SERVER_KEY);
var mysql = require('mysql');
var dbconfig = require('../config.js').MYSQL_CONFIG;
var pool = mysql.createPool(dbconfig);

var mysqla = require('./mysql.js');

// App이 재시작할때 기 등록된 알림이 있었는지 확인하는 함수.
function isNumberWait(req, res){
	var fcmToken = req.body.fcmtoken;
	var ordernums=[];
	var cafecode;
	pool.getConnection(function(err, connection){
		if(err){
			logger('error', err, isNumberWait);
			res.status(402).send('err');
		}
		var query = connection.query('select ordernum, cafecode from number where flag=0 and token=\''+fcmToken + '\'', function(err, rows, fields){
			connection.release();
			if(!err){
				if(rows.length != 0){
					for(var i in rows){
						ordernums.push(rows[i].ordernum);
					}
					cafecode = rows[0].cafecode;
					return res.json({"cafecode":cafecode, num:ordernums});
				}
				else {
					// console.log('you are not wait');
					return res.status(400).send('not wait');
				}
			}
			else{
				logger('error', err, isNumberWait);
				return res.sendStatus(402);
			}
		});
	});
}

function registerNumber(req, res){
	var code = req.body.code;
	var token = req.body.token;
	var num1 = req.body.num1;
	var num2 = req.body.num2;
	var num3 = req.body.num3;
	var device = req.body.device;
	var added = [];
	var nums = [num1];

	if(num2) nums.push(num2);
	if(num3) nums.push(num3);

	pool.getConnection(function(err, connection){
		if(err){
			logger('error', err, registerNumber);
			res.send('err');
		}
		else {
			var tasks = [
			];
			// map은 각각 별도로 호출해 for로 callback을 불렀을때 인덱스 오류를 잡을수 있다.
			nums.map(function(num){
				if(num != -1){
					tasks.push(function(callback){
						insertNumber(connection, 'insert into number set?', {cafecode:code, token:token, ordernum:num, device:device},callback);
					});
				}
			});
			asc.series(tasks, function(err,results){
				connection.release();
				while(results.indexOf(0) >-1){
					results.splice(results.indexOf(0),1);
				}
				res.json({"cafecode":code,"token":token, "nums":results});
				if(results.length == 0) {
					results = "nothing";
				}
				logger('info', 'cafecode : ' + code + ', ' + results + ' registered.', registerNumber);
			});
		}
	});
}

function insertNumber(connection, sql, data, callback){
	connection.query(sql,data,
		function(err, results){
			var ret;
			// console.log(nums[i]);
			if(err){
				ret = 0;
			} else{
				ret = data.ordernum;
			}
			callback(null, ret);
		}
	);
}

// EDMS에서 번호 주는 함수
function pushNumber(req,res){
	var num = req.query.num;
	var code = req.query.code;
	var cafe = require('../public/cafecode.json');
	logger('info', 'cafecode : ' + code + ' : ' + num, pushNumber);
	// console.log('[number/getPushNumber/params]' + code + ' ' + num );

	const options = {
		method : 'GET',
		uri : 'http://inucafeteriaaws.us.to:3829/socket?code='+code+'&num='+num
	}

	request(options,
		function (err, response, body){
			if(!err){
				// console.log('[number/pushNumber/request] SUCCESS ' + body);
			}
			else {
				logger('error', err, pushNumber);
				// console.log('[number/pushNumber] Error ' + error);
			}
		}
	);

	pool.getConnection(function(err, connection){
		if(err){
			connection.release();
			logger('error', err, pushNumber);
			// console.log('[number/pushNumber] DB_Connection_Select_ERROR')
			return res.json({'result':'error'});
		}
		var query = connection.query('select token, device from number where ordernum=? and cafecode=? and flag=0', [num, code], function(err, rows, fields){
			if(!err){
				switch(rows.length){
					case 1:
						var token = rows[0].token;
						var device = rows[0].device;
						connection.query('update number set flag=1 where token=? and ordernum=? and cafecode=? ', [token, num, code], function(err, rows, fields){
							connection.release();
							if(err){
								logger('error', err, pushNumber);
								// console.log('[number/pushNumber] DB_UPDATE_ERR ' + err);
							}
						});
						var message;
						if(device == 'ios'){
							message = {
								to: token,
								priority : "high",
								notification: {
									title: cafe[code-1].name, //title of notification
									body: "주문하신 " + num + "번 음식이 완료되었습니다.", //content of the notification
									sound: "out.caf",
									icon: "ic_launcher", //default notification icon
								},
								time_to_live : 0
							};
						} else{
							message = {
								to: token,
								priority : "high",
								data: {
									title: cafe[code-1].name, //title of notification
									body: num, //content of the notification
									sound: "default",
									icon: "ic_launcher", //default notification icon
								},
								time_to_live : 0
							};
						}
						fcm.send(message, function(err, response){
							if (err) {
								fcm.send(message, function(err, response){
									if(err){
										logger('error', token + err, pushNumber);
										// return res.json({'result':'SUCCESS'});
									}
								});
							}
						});
						break;
					case 0:
						// console.log('[number/pushNumber] Not_Exist');
					break;
				}
				return res.json({'result':'SUCCESS'});
			}
			else {
				logger('error', err, pushNumber);
				return res.json({'result':'ERROR'});
				// console.log('[number/pushNumber] DB_Connection_ERROR');
			}
		});
	}
);
}

function resetNumber(req, res){
	var fcmtoken = req.body.fcmtoken;
	if(!fcmtoken){
		return res.status(400).sned('err');
	}
	pool.getConnection(function(err, connection){
		if(err){
			logger('error', err, resetNumber);
			res.status(402).send('err');
		}
		else{
			connection.query('delete from number where token=\'' + fcmtoken + '\'' ,
			function(err, results){
				connection.release();
				if(err){
					logger('error', fcmtoken + err, resetNumber);
					// console.log('[number/resetNumber] DB_QUERY_ERROR :' + fcmtoken)
					return res.status(402).send('err');
				} else{
					logger('info', 'SUCCESS : ' + fcmtoken.substring(0,10), resetNumber);
					return res.json({"result":"success"});
				}
			}
		);}
	});
}

module.exports.isNumberWait = isNumberWait;
module.exports.pushNumber = pushNumber;
module.exports.registerNumber = registerNumber;
module.exports.resetNumber = resetNumber;
