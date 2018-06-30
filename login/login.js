const oracledb = require('oracledb');
const oracledbconfig = require('./config.js').DB_CONFIG;
const sqls = require('./config.js').SQLS;
const moment = require('moment');
const util = require('util');
// pw 양방향 암호화
const crypto = require('crypto');
const password = require('./config.js').PASSWORD;
const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

// TODO 파일 로그 추가하기.


/*
로그인 리턴
Y : 할인 대상자
N : ID/PW 틀림, 할인 대상자 아님
400 : 로그인 정보 오류
402 : 토큰만료(재로그인)
403 : 토큰 없음(타 기기에서 자동로그인 덮어씌움)
404 : DB 연결 오류
405 : DB 조회 오류
*/

//F_LOGIN_KLIN
// 일반 학생 로그인.


function login(req, res) {
  let sno = req.body.sno;
  let pw = req.body.pw;
  // pw 복호화
  if(!base64regex.test(pw)){
			res.status(400).send('비정상 접근');
      console.log('[ROUTER/LOGIN] DECYPT ERR ' + JSON.stringify(req.body || '', null, ' '));
      return;
	}
  try{
    let decipher = crypto.createDecipher('aes-256-cbc', password);
    let decypt = decipher.update(pw, 'base64', 'utf-8');
    decypt += decipher.final('utf-8');
    pw = decypt;
  }
  catch(e){
    res.status(400).send('비정상 접근');
    console.log('[ROUTER/LOGIN] DECYPT ERR ' + JSON.stringify(req.body || '', null, ' ')+e);
    return;
  }
  let login_sql = "";

  // 빈칸 체크
  if(!sno || !pw){
    res.sendStatus(400);
    return;
  }

  // 학번 길이에 따라 다른 뷰 사용.
  // 일반 학생
  if(sno.length == 9){
    login_sql = sqls.LOGIN_CHECK_SQL;
  }
  // 한국어 학당 학생
  else if(sno.length == 10){
    login_sql = sqls.KLOGIN_CHECK_SQL;
  }
  // 잘못된 자릿수
  else {
    console.log('[ROUTER/GETSTUDENTINFO] STU_NO_ERROR ' + sno);
    res.sendStatus(400);
    return;
  }

  // 오라클연결.
  oracledb.getConnection(oracledbconfig, function(err,connection){
    if(err){
      console.log(err + ' ' + sno);
      // res.send(err);
      res.sendStatus(404);
      return ;
    }

    // 학번만으로 재학생 여부 판별. (학부/대학원/한국어학당)
    var bindvar = {sno:sno};
    connection.execute(sqls.ENROLL_CHECK_SQL, bindvar, {maxRows:1}, function(err, result){
      if(err){
        console.log(err+' '+sno+' 재학생 체크 에러');
        res.sendStatus(405);
        doRelease(connection);
        return;
      }
      result = result.rows[0][0];
      // result = result[0];
      if(result == 'Y'){

        // 포탈 로그인 체크
        bindvar = {sno:sno, pw:pw};
        connection.execute(login_sql, bindvar, {maxRows:1}, function(err,result){
          if(err){
            console.log(err+' '+sno+' 로그인 체크 에러');
            res.sendStatus(405);
            doRelease(connection);
            return;
          }
          result = result.rows[0][0];
          // result = result[0];
          console.log(util.format('[%s] %s 로그인 조회 : %s', moment().format('YY/MM/DD HH:mm:ss')), sno, result);
          res.send(result);
          doRelease(connection);
        });
      }
      else {
        console.log(util.format('[%s] %s 재학생 조회 : N', moment().format('YY/MM/DD HH:mm:ss')), sno);
        res.send(result);
        doRelease(connection);
      }
    });
  });
} // postlogin end

function doRelease(conn){
  conn.release(function(err){
    if(err){
      console.log(err);
    }
  });
}

module.exports.postlogin = login;
