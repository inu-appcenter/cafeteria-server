
var oracledb = require('oracledb');
var oracledbconfig = require('./oracledbconfig.js');


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
  var sno = req.body.sno;
  var pw = req.body.pw;
  // var device = req.body.device;
  var sql = "";
  // var json = require('./code.json');
  var result = new Array();

  // 빈칸 체크
  if(!sno || !pw){
    res.sendStatus(400);
    return;
  }

  // 학번 길이에 따라 뷰를 다르게 사용.
  // 일반 학생
  if(sno.length == 9){
    sql = 'SELECT F_LOGIN_CHECK(:sno, :pw) AS success FROM DUAL';
  }
  // 한국어 학당 학생
  else if(sno.length == 10){
    sql = 'SELECT F_LOGIN_KLIN(:sno, :pw) AS success FR OM DUAL';
  }
  // 잘못된 자릿수
  else {
    console.log('[ROUTER/GETSTUDENTINFO] STU_NO_ERROR');
    // 잘못된 값이라고 반환.
    res.sendStatus(400);
    return;
  }

  var bindvar = {sno:sno, pw:pw};

  // 오라클에서 조회.
  oracledb.getConnection(
    oracledbconfig ,
    function(err,connection){
      if(err){
        console.log(err + ' ' + studentNum);
        // res.send(err);
        res.sendStatus(404);
        return ;
      }
      connection.execute
      (
        sql,
        bindvar,
        {maxRows:1},
        function(err,result){
          if(err){
            console.log(err + ' ' + studentNum);
            res.sendStatus(405);
            return;
          }
          result = result.rows[0];
          result = result[0];
          console.log(sno + " 조회");
          res.send(result);
          res.end();
          doRelease(connection);
        }
      );
    }
  )
} // postlogin end

function doRelease(conn){
  conn.release(function(err){
    if(err){
      console.log(err);
    }
  });
}

module.exports.postlogin = login;
