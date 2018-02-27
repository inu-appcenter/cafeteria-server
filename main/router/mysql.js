// copyright(c) 2017 All rights reserved by jaemoon(jjaemny@naver.com) 201201646 정보통신공학과 신재문

var mysql = require('mysql');
var dbconfig = require('../config.js').MYSQL_CONFIG;
var pool = mysql.createPool(dbconfig);

function setAutoLogin(token, sno, device){
  pool.getConnection(function(err, connection){
    if(err){
      res.send('err');
    }
    else{
      connection.query('insert into autologin set?',{"token":token,"student_no":sno,"device":device},
      function(err, results){
        connection.release();
        if(err){
          if(typeof callback === 'fucntion') callback('err');
        } else{
          if(typeof callback === 'function') callback('suc');
        }
      }
    );}
  });
}

// true : 중복됨
function checkTokenDup(token){
  pool.getConnection(function(err, connection){
    if(err){
      res.send('err');
    }
    var query = connection.query('select token from autologin where token=\'' + token + '\'', function(err, rows, fields){
      if(!err){
        // console.log(rows.length);
        if(rows.length != 0){
          ret = true;
        }
        else {
          ret = false;
        }
      }
      else{
        console.log('[mysql/checkTokenDup] QUERY_ERROR' + err);
        ret = null;
      }
      connection.release();
      return ret;
    }
  );
});
}

function releaseAutoLogin(token){
  pool.getConnection(function(err, connection){
    if(err){
      res.send('err');
    }
    else{
      connection.query('delete from autologin where token=\'' + token + '\'',
      function(err, results){
        connection.release();
        if(err){
          if(typeof callback === 'fucntion') callback('err');
        } else{
          if(typeof callback === 'function') callback('suc');
        }
      }
    )}
  })
}

function releaseAutoLoginBySno(sno){
  pool.getConnection(function(err, connection){
    if(err){
      res.send('err');
    }
    else{
      connection.query('delete from autologin where student_no=\'' + sno + '\'',
      function(err, results){
        connection.release();
        if(err){
          if(typeof callback === 'fucntion') callback('err');
        } else{
          if(typeof callback === 'function') callback('suc');
        }
      }
    )}
  })
}

function deleteBarcode(barcode){
  pool.getConnection(function(err, connection){
    if(err){
      res.send('err');
    }
    else{
      connection.query('delete from barcode where barcode=\'' + barcode + '\'',
      function(err, results){
        connection.release();
        if(err){
          if(typeof callback === 'fucntion') callback('err');
        } else{
          if(typeof callback === 'function') callback('suc');
        }
      }
    )}
  })
}

function activateBarcode(active, barcode){
  pool.getConnection(function(err, connection){
    if(err){
      res.send('err');
    }
    else{
      connection.query('update barcode set activated =' + active + ' where barcode=\'' + barcode + '\'',
      function(err, results){
        connection.release();
        if(err){
          // if(typeof callback === 'fucntion') callback('err');
        } else{
          // if(typeof callback === 'function') callback('suc');
        }
      }
    );}
  });
}


function addBarcode(barcode){
  pool.getConnection(function(err, connection){
    if(err){
      res.send('err');
    }
    else{
      connection.query('insert into barcode set?',{"barcode":barcode},
      function(err, results){
        connection.release();
        if(err){
          if(typeof callback === 'fucntion') callback('err');
        } else{
          if(typeof callback === 'function') callback('suc');
        }
      }
    )}
  })
}

function checkBarcode(barcode){
  pool.getConnection(function(err, connection){
    if(err){
      res.send('err');
    }
    var query = connection.query('select barcode from barcode where barcode=\''+barcode + '\'', function(err, rows, fields){
      if(!err){
        if(rows.length != 0){
          //console.log('[mysql/checkBarcode] ' + barcode + ' is already exist');
        }
        else{
          //console.log('[mysql/checkBarcode] ' + barcode + ' SUCCESS');
          addBarcode(barcode);
        }
      }
      else{
        console.log('[mysql/checkBarcode] ' + barcode + ' QUERY_ERROR');
        res.sendStatus(404);
      }
    });
    connection.release();
  });
}

function putError(sno,title,msg,device,service){
  pool.getConnection(function(err, connection){
    if(err){
      res.send('err');
    }
    else{
      connection.query('insert into error set?',{student_no:sno, title:title, message:msg, device:device, service:service},
      function(err, results){
        connection.release();
        if(err){
          if(typeof callback === 'fucntion') callback('err');
        } else{
          if(typeof callback === 'function') callback('suc');
        }
      }
    );}
  });
}

function getError(callback){
  pool.getConnection(function(err, connection){
    if(err){
      res.send('err');
    }
    else{
      connection.query('select * from error',
      function(err, rows, fields){
        connection.release();
        if(err){
          // if(typeof callback === 'fucntion') callback('err');
        } else{
          // if(typeof callback === 'function') callback('suc');
          callback(null, rows);
        }
      }
    );}
  });
}

module.exports.setAutoLogin = setAutoLogin;
module.exports.releaseAutoLogin = releaseAutoLogin;
module.exports.releaseAutoLoginBySno = releaseAutoLoginBySno;
module.exports.checkTokenDup = checkTokenDup;

module.exports.addBarcode = addBarcode;
module.exports.deleteBarcode = deleteBarcode;
module.exports.activateBarcode = activateBarcode;
module.exports.checkBarcode = checkBarcode;

module.exports.putError = putError;
module.exports.getError = getError;
