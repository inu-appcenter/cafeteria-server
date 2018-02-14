// copyright(c) 2016 All rights reserved by jongwook(koyu1212@naver.com) 201003051 컴퓨터공학부 고종욱
// edited by jaemoon 201201646 정보통신공학과 신재문

var wookora = require('wookora');
var http = require('http');
var fs = require('fs');
function getstudentinfo(req, res, next) {
	var sql =
		'select v_campus_01.student_no as student_no,'+
		'v_campus_01.nm as name,'+
		'v_campus_01.cls_nm as department,'+
		'nvl(v_campus_01.maj_nm,'+
		'v_campus_01.cls_nm) as major,'+
		'v_campus_01.univ_nm as '+
		'main_div,'+
		'v_campus_01.status as stu_stat '+
		'from '+
		'v_campus_01 '+
		'where '+
		'v_campus_01.student_no = :sno'
	var bindvar = {sno:  req.body.sno}
	 wookora.execute(
     sql,bindvar,{outFormat: wookora.OBJECT},
       function(err, results) {
          if (err) {
            console.log('[ROUTER/GETSTUDENTINFO] ERROR');
             next(err);
             return;
          }
          // console.log(results.rows[0])
					if(results.rows[0]){
					// console.log('[ROUTER/GETSTUDENTINFO] SUCCESS');

					var stu_num = results.rows[0].STUDENT_NO;
					var name = results.rows[0].NAME;
					var dep  = results.rows[0].DEPARTMENT;
					var stat = results.rows[0].STU_STAT;

					req.session.stu_info = {"stu_num":stu_num,"name":name,"dep":dep,"stat":stat};
					console.log(results.rows[0]);


					next();
				}
				else{
					console.log('[ROUTER/GETSTUDENTINFO] STU_NO_ERROR');
					res.sendStatus(400);
				}
		// res.header("Content-Type", "application/json; charset=utf-8");
    //     res.json(stu_info);
		// res.end();
       }
   );
}

function studentinfo(req, res, next) {
	var sql =
		'select v_campus_01.student_no as student_no,'+
		'v_campus_01.nm as name,'+
		'v_campus_01.cls_nm as department,'+
		'nvl(v_campus_01.maj_nm,'+
		'v_campus_01.cls_nm) as major,'+
		'v_campus_01.univ_nm as '+
		'main_div,'+
		'v_campus_01.status as stu_stat '+
		'from '+
		'v_campus_01 '+
		'where '+
		'v_campus_01.student_no = :sno'
	var bindvar = {sno:  req.body.sno}
	 wookora.execute(
     sql,bindvar,{outFormat: wookora.OBJECT},
       function(err, results) {
          if (err) {
            console.log('[ROUTER/GETSTUDENTINFO] ERROR');
             next(err);
             return;
          }
          // console.log('[ROUTER/GETSTUDENTINFO] SUCCESS');
          // console.log(results.rows[0])

					var stu_num = results.rows[0].STUDENT_NO;
					var name = results.rows[0].NAME;
					var dep  = results.rows[0].DEPARTMENT;
					var stat = results.rows[0].STU_STAT;

					res.send(results.rows[0]);
       }
   );
}

module.exports.getstudentinfo = getstudentinfo;
module.exports.studentinfo = studentinfo;
