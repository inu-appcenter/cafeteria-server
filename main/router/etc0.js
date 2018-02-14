// copyright(c) 2016 All rights reserved by jongwook(koyu1212@naver.com) 201003051 컴퓨터공학부 고종욱
// edited by jaemoon 201201646 정보통신공학과 신재문

var wookora = require('wookora');
var mysql = require('./mysql.js');
var moment = require('moment');
var winston = require('winston');

var mysqld = require('mysql');
var dbconfig = require('../info/mysqldbconfig.js');
var pool = mysqld.createPool(dbconfig);
require('date-utils');

var logger = new (winston.Logger)({
	transports:[
		new (winston.transports.Console)({
			name:'consoleLog',
			colorize:false,
			timestamp: function(){return new Date().toFormat('YYYY-MM-DD HH24:MI:SS')},
			json:false
		}),

		new (winston.transports.File)({
			name:'infoLog',
			level:'info',
			filename:'./data/log/info.log',
			maxsize:10000000,
			maxFile:10,
			timestamp: function(){return new Date().toFormat('YYYY-MM-DD HH24:MI:SS')},
			dataPattern:'yyyyMMdd',
			json:false
		}),
		new (winston.transports.File)({
			name:'errorLog',
			level:'error',
			filename:'./data/log/err.log',
			maxsize:10000000,
			maxFile:10,
			timestamp: function(){return new Date().toFormat('YYYY-MM-DD HH24:MI:SS')},
			dataPattern:'yyyyMMdd',
			json:false
		})
	]
});

//F_LOGIN_KLIN
// 일반 학생 로그인.
function postlogin(req, res, next) {
	var sno = req.body.sno;
	var device = req.body.device;
	var dtoken = "";
	var barcode = "";
	var sql = "";
	var json = require('./code.json');
	var result = new Array();
	var login;

	// 학번 길이에 따라 뷰를 다르게 사용.
	// 일반 학생
	if(sno.length == 9){
		sql = 'SELECT F_LOGIN_CHECK(:sno, :pw) AS success FROM DUAL';
	}
	// 한국어 학당 학생
	else if(sno.length == 10){
		sql = 'SELECT F_LOGIN_KLIN(:sno, :pw) AS success FROM DUAL';
	}
	// 잘못된 자릿수
	else {
		console.log('[ROUTER/GETSTUDENTINFO] STU_NO_ERROR');
		// 잘못된 값이라고 반환.
		res.sendStatus(400);
		return;
	}

	var bindvar = {sno:req.body.sno, pw:req.body.pw}
	// 오라클에서 조회.
	wookora.execute( sql, bindvar, {outFormat: wookora.OBJECT}, function(err, results) {
			if (err) {
				next(err);
				res.sendStatus(404);
				console.log('postlogin 오라클 연결 실패 ' + err);
				return;
			}
			res.header("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
			result = results.rows[0];

			// 로그인 성공(재학생, 휴학생)
			if(result['SUCCESS']=="Y"){
				// status, device 어디다 쓰는지 모름.
				req.session.status = true;
				var barcode = (req.session.user*6).toString();
				mysql.checkBarcode(barcode);
			}
			// 졸업생 등의 바코드가 없는 사람.
			else if(result['SUCCESS']==""){
				req.session.user = req.body.sno;
				req.session.status = true;
				req.session.device = req.body.device;
				login = {"dtoken":dtoken};
			}
			// 그 외
			else {
				console.log('로그인 함수의 알수 없는 응답');
				res.sendStatus(400);
				return;
			}

			// 자동로그인 등록
			if(req.body.auto == 'true'){
				dtoken = registerAutologin(sno, device);
			}
			console.log('[etc/postlogin] ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + req.body.sno + ' SUCCESS');
			login = {"barcode":barcode, "dtoken":dtoken};
			res.json({"login":login,"code":json});
			res.end();
		} // 오라클 콜백 끝.
	); // wookora.execute end
} // postlogin end

function registerAutologin(sno, device){
	// console.log('[etc/postlogin_auto] ' + req.body.sno + ' SUCCESS');
	var dtoken = moment().format('mmss')*3 + sno + 't';
	pool.getConnection(function(err, connection){
		if(err){
			res.send('err');
			return "";
		}
		var query = connection.query('select student_no from autologin where student_no=\''+sno + '\'' , function(err, rows, fields){
			if(!err){
				if(rows.length != 0){
					// 자동로그인으로 다중 접속 방지
					mysql.deleteDtokenBySno(sno);
					mysql.putAuto(dtoken, sno, device);
				}
				else{
					mysql.putAuto(dtoken, sno, device);
				}
			}
			else{
				console.log('자동로그인 등록 오류. 학번:' + sno + ' 에러:' + err);
				res.sendStatus(400);
			}
		});
		connection.release();
		return dtoken;
	});
	return "";
}


function Kpostlogin(req, res, next) {			//한국어학당 학생들
	var json = require('./code.json');
	var result = new Array();
	var sql =
	'SELECT F_LOGIN_KLIN(:sno, :pw) AS success FROM DUAL';
	var bindvar = {sno:req.body.sno, pw:req.body.pw}
	wookora.execute(
		sql,bindvar,{outFormat: wookora.OBJECT},
		function(err, results) {
			if (err) {
				next(err);
				res.sendStatus(404);
				return;
			}

			result = results.rows[0];
			if(result['SUCCESS']=="Y"){
				req.session.user = req.body.sno;
				req.session.status = true;
				req.session.device = req.body.device;
				var barcode = (req.session.user*4).toString();
				req.session.barcode = barcode;
				if(req.body.auto == 'true'){
					// console.log('[etc/postlogin_auto] ' + req.body.sno + ' SUCCESS');
					var dtoken = moment().format('mmss')*3 + req.body.sno + 't';
					req.session.dtoken = dtoken;
					var sno = req.body.sno;
					var device = req.body.device;

					pool.getConnection(function(err, connection){
						if(err){
							res.send('err');
						}
						var query = connection.query('select student_no from autologin where student_no=\''+sno + '\'' , function(err, rows, fields){
							if(!err){
								if(rows.length != 0){
									mysql.deleteDtokenBySno(sno);
									mysql.putAuto(dtoken, sno, device);
								}
								else{
									mysql.putAuto(dtoken, sno, device);
								}
							}
							else{
								console.log('err');
								res.sendStatus(400);
							}
						});
						connection.release();
					});
				}

				// 한국어학당도 상태가 나온다...
				var stu_info = req.session.stu_info;
				if(stu_info.stat == '재학' || stu_info.stat == '수료' || stu_info.stat == '휴학'){
					stu_info.stat = '재학';
					var login = {"dtoken":dtoken,"barcode":barcode};
					mysql.checkBarcode(barcode);
				}
				else{
					var login = {"dtoken":dtoken};
				}
				console.log('[etc/postlogin] ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + req.body.sno + ' SUCCESS');
				// console.log(stu_info);
				res.json({"login":login,"code":json,"stu_info":stu_info});
				// console.log(req.body.sno + ' suc');
				// res.json({"dtoken":dtoken});
			}
			else{
				res.sendStatus(400)	//로그인 실패
				console.log('[etc/postlogin] ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + req.body.sno + ' PW_ERROR');
			}
			res.end();
		}
	);
}


// Number서버에서 쓰는 함수
// function isNumberWait(req, res, next){
// 	var fcmToken = req.body.fcmtoken;
// 	var num1;
// 	var num2;
// 	var num3;
// 	var code;
// 	pool.getConnection(function(err, connection){
// 		if(err){
// 			res.send('err');
// 		}
// 		var query = connection.query('select num1,num2,num3, code from number where token=\''+fcmToken + '\'' +  ' and flag=' + '\'' + 1 + '\'', function(err, rows, fields){
// 			if(!err){
// 				if(rows.length != 0){
// 					num1 = rows[0].num1;
// 					num2 = rows[0].num2;
// 					num3 = rows[0].num3;
// 					code = rows[0].code;
// 					console.log('your state is wait');
// 				}
// 				else{
// 					console.log('you are not wait');
// 				}
// 				res.json({"num1":num1,"num2":num2,"num3":num3,"code":code});
// 			}
// 			else{
// 				console.log('err');
// 				res.sendStatus(400);
// 			}
// 		});
// 		connection.release();
// 	});
// }



function autologin(req, res, next){
	var json = require('./code.json');
	var sno = req.body.sno;
	var dtoken = req.body.dtoken;
	req.session.dtoken = dtoken;

	pool.getConnection(function(err, connection){
		if(err){
			res.send('err');
		}
		var query = connection.query('select dtoken from autologin where dtoken=\''+dtoken + '\'' + ' and student_no=\'' + sno + '\'', function(err, rows, fields){
			if(!err){
				if(rows.length != 0){
					req.session.user = req.body.sno;
					var stu_info = req.session.stu_info;
					if(stu_info.dep == '한국어학당'){
						var barcode = (req.session.user*4).toString();
					}else{
						var barcode = (req.session.user*6).toString();
					}
					req.session.barcode = barcode;
					req.session.status = true;
					req.session.device = rows[0].device;
					console.log('[etc/autologin] ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + req.body.sno + ' SUCCESS');
					if(stu_info.stat == '재학' || stu_info.stat == '수료' || stu_info.stat == '휴학'){
						stu_info.stat = '재학';
						res.json({"barcode":barcode,"code":json,"stu_info":stu_info});
					}
					else{
						res.json({"code":json,"stu_info":stu_info});
					}
				}
				else{
					console.log('[etc/autologin] ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + req.body.sno + ' TOKEN_ERROR');
					res.sendStatus(400);
				}
			}
			else{
				console.log('[etc/autologin] ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + req.body.sno + ' QUERY_ERROR');
				res.sendStatus(404);
			}
		});
		connection.release();
	});
}




function logout(req, res, next){
	if(req.session.dtoken){
		console.log('[etc/logout] 자동로그인 상태에서 접근');
		var dtoken = req.session.dtoken;
		mysql.deleteDtoken(dtoken);
	}
	req.session.destroy();
	res.json({"result":"logout is successful"});
}




function activeBarcode(req, res, next){
	var activeBarcode = req.body.flag;
	var device = req.body.device;
	var barcode = req.body.barcode;
	// if(device == 'android'){
	// barcode = req.body.barcode;
	// } else{
	// 	barcode = req.session.barcode;
	// }
	mysql.updateBarcodeFlag(activeBarcode,barcode);
	console.log('Student(' + barcode/6 + ') flag is ' + activeBarcode);
	res.json({"active":activeBarcode});
}



function isBarcode(req,res,next){
	var barcode = req.query.barcode;
	pool.getConnection(function(err, connection){
		if(err){
			console.log('[etc/isBarcode] DB_Connection_Error');
			res.status(404).json({ message : "DB_ERROR"});
		}
		var query = connection.query('select flag from barcode where barcode=' + barcode , function(err, rows, fields){
			if(!err){
				if(rows.length != 0){
					var flag = rows[0].flag;
					if(flag == 1){
						logger.info(barcode/6 + ' 조식할인');
						// console.log('[etc/isBarcode] ' + barcode/6 + '님이 조식할인을 받으셨습니다.');
					}
					else{
						logger.info(barcode/6 + ' 불법적인 경로');
						// console.log('[etc/isBarcode] ' + barcode/6 + '님이 불법적인 경로로 할인시도를 하였습니다.');
					}
					return res.status(200).json({message : "SUCCESS","flag":flag});
				}
				else{
					console.log('[etc/isBarcode] Barcode_Error');
					console.log('[etc/isBarcode] Barcode is ' + barcode);
					return res.status(400).json({ message : 'BARCODE_ERROR'});
				}
			}

			else{
				console.log('[etc/isBarcode] Query_Error');
				return res.status(404).json({ message : 'QUERY_ERROR'});
			}
		});
		connection.release();
	});
}






function postIsBarcode(req,res,next){
	var barcode = req.body.barcode;
	pool.getConnection(function(err, connection){
		if(err){
			console.log('[etc/isBarcode] DB_Connection_Error');
			res.status(404).json({ message : "DB_ERROR"});
		}
		var query = connection.query('select flag from barcode where barcode=\''+barcode + '\'', function(err, rows, fields){
			if(!err){
				if(rows.length != 0){
					var flag = rows[0].flag;
					console.log('[etc/postIsBarcode] ' + barcode + ',' + flag + ' SUCCESS');
					return res.status(200).json({message : "SUCCESS","flag":flag});
				}
				else{
					console.log('[etc/postIsBarcode] Barcode_Error');
					console.log('[etc/postIsBarcode] Barcode is ' + barcode);
					return res.status(400).json({ message : 'BARCODE_ERROR'});
				}
			}

			else{
				console.log('[etc/isBarcode] Query_Error');
				return res.status(404).json({ message : 'QUERY_ERROR'});
			}
		});
		connection.release();
	});
}


function errMsg(req, res, next){
	var sno = req.body.sno;
	var msg = req.body.msg;

	console.log('error_msg is registered');

	mysql.putError(sno,msg);
	res.json({"result":"success"});
}





module.exports.postlogin = postlogin;
module.exports.autologin = autologin;
module.exports.logout = logout;
module.exports.activeBarcode = activeBarcode;
module.exports.isBarcode = isBarcode;
module.exports.isNumberWait = isNumberWait;
module.exports.postIsBarcode = postIsBarcode;
module.exports.errMsg = errMsg;
module.exports.Kpostlogin = Kpostlogin;
