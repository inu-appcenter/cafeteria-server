// copyright(c) 2017 All rights reserved by jaemoon(jjaemny@naver.com) 201201646 정보통신공학과 신재문

const mysql = require('mysql');
const dbconfig = require('../config.js').MYSQL_CONFIG;
const pool = mysql.createPool(dbconfig);
const logger = require('./logger.js');

function setAutoLogin(token, sno, device){
  pool.getConnection(function(err, connection){
    if(err){
      logger('error', err, setAutoLogin);
      res.send('err');
    }
    else{
      connection.query('insert into autologin set?',{"token":token,"student_no":sno,"device":device},
      function(err, results){
        connection.release();
        if(err){
          logger('error', err, setAutoLogin);
          // if(typeof callback === 'fucntion') callback('err');
        } else{
          // if(typeof callback === 'function') callback('suc');
        }
      }
    );}
  });
}

// true : 중복됨
function checkTokenDup(token){
  pool.getConnection(function(err, connection){
    if(err){
      logger('error', err, checkTokenDup);
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
        logger('info','QUERY_ERROR' + err, checkTokenDup);
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
      logger('error', err, releaseAutoLogin);
      res.send('err');
    }
    else{
      connection.query('delete from autologin where token=\'' + token + '\'',
      function(err, results){
        connection.release();
        if(err){
          logger('error', err, releaseAutoLogin);
          // if(typeof callback === 'fucntion') callback('err');
        } else{
          // if(typeof callback === 'function') callback('suc');
        }
      }
    );}
  });
}

function releaseAutoLoginBySno(sno){
  pool.getConnection(function(err, connection){
    if(err){
      logger('error', err, releaseAutoLoginBySno);
      res.send('err');
    }
    else{
      connection.query('delete from autologin where student_no=\'' + sno + '\'',
      function(err, results){
        connection.release();
        if(err){
          logger('error', err, releaseAutoLoginBySno);
          // if(typeof callback === 'fucntion') callback('err');
        } else{
          // if(typeof callback === 'function') callback('suc');
        }
      }
    );}
  });
}

function deleteBarcode(barcode){
  pool.getConnection(function(err, connection){
    if(err){
      logger('error', err, deleteBarcode);
      res.send('err');
    }
    else{
      connection.query('delete from barcode where barcode=\'' + barcode + '\'',
      function(err, results){
        connection.release();
        if(err){
          logger('error', err, deleteBarcode);
          // if(typeof callback === 'fucntion') callback('err');
        } else{
          // if(typeof callback === 'function') callback('suc');
        }
      }
    );}
  });
}

function activateBarcode(active, barcode){
  pool.getConnection(function(err, connection){
    if(err){
      logger('error', err, activateBarcode);
      res.send('err');
    }
    else{
      connection.query('update barcode set activated =' + active + ' where barcode=\'' + barcode + '\'',
      function(err, results){
        connection.release();
        if(err){
          logger('error', err, activateBarcode);
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
      logger('error', err, addBarcode);
      res.sendStatus(404);
      return false;
    }
    else{
      connection.query('insert into barcode set?',{"barcode":barcode},
      function(err, results){
        connection.release();
        if(err){
          return false;
        } else{
          return true;
        }
      }
    );}
  });
}

function checkBarcode(barcode){
  pool.getConnection(function(err, connection){
    if(err){
      logger('error', err, checkBarcode);
      res.send('err');
    }
    var query = connection.query('select barcode from barcode where barcode=\''+barcode + '\'', function(err, rows, fields){
      connection.release();
      if(!err){
        if(rows.length != 0){
          return true;
          //console.log('[mysql/checkBarcode] ' + barcode + ' is already exist');
        }
        else{
          //console.log('[mysql/checkBarcode] ' + barcode + ' SUCCESS');
          return addBarcode(barcode);
        }
      }
      else{
        logger('info','barcode : ' + barcode + ' QUERY_ERROR', checkBarcode);
        res.sendStatus(404);
        return false;
      }
    });
  });
}

function putError(sno,title,msg,device,service){
  pool.getConnection(function(err, connection){
    if(err){
      logger('error', err, putError);
      res.send('err');
    }
    else{
      connection.query('insert into error set?',{student_no:sno, title:title, message:msg, device:device, service:service},
      function(err, results){
        connection.release();
        if(err){
          logger('error',err, putError);
          // if(typeof callback === 'fucntion') callback('err');
        } else{
          // if(typeof callback === 'function') callback('suc');
        }
      }
    );}
  });
}

function getError(callback){
  pool.getConnection(function(err, connection){
    if(err){
      logger('error', err, getError);
      res.send('err');
    }
    else{
      connection.query('select * from error',
      function(err, rows, fields){
        connection.release();
        if(err){
          logger('error', err, getError);
          // if(typeof callback === 'fucntion') callback('err');
        } else{
          // if(typeof callback === 'function') callback('suc');
          callback(null, rows);
        }
      }
    );}
  });
}
function updateBarcodeCheckTime(barcode){
  pool.getConnection(function(err, connection){
    if(err){
      logger('error', err, updateBarcodeCheckTime);
      return err;
    }
    else{
      connection.query('UPDATE barcode set lastchecktime = CURRENT_TIMESTAMP where barcode = ' + barcode,
      function(err, rows, fields){
        connection.release();
        if(err){
          logger('error', err, updateBarcodeCheckTime);
        } else{
          // console.log(rows);
        }
      }
    );}
  });
}

function getPaymentCount(){
  pool.getConnection(function(err, connection){
    if(err){
      logger('error', err, getPaymentCount);
      return err;
    }
    else{
      connection.query('SELECT cafecode, count(*) as count FROM `payment` GROUP BY cafecode',
      function(err, rows, fields){
        connection.release();
        if(err){
          logger('error', err, getPaymentCount);
          return err;
        } else{
          // console.log(rows);
          return rows;
        }
      }
    );}
  });
}

function getNumberCount(){
  pool.getConnection(function(err, connection){
    if(err){
      logger('error', err, getNumberCount);
      return err;
    }
    else{
      connection.query('SELECT flag, count(*) as count FROM `number` GROUP BY flag',
      function(err, rows, fields){
        connection.release();
        if(err){
          logger('error', err, getNumberCount);
          return err;
        } else{
          // logger('info', rows, getNumberCount);
          // console.log(rows);
          return rows;
        }
      }
    );}
  });
}

function customQuery(sql, cb){
  pool.getConnection(function(err, connection){
    if(err){
      logger('error', err, customQuery);
      return err;
    }
    else{
      connection.query(sql,
      function(err, rows, fields){
        connection.release();
        if(err){
          console.error(err);
          // logger('error', err, customQuery);
          return err;
        } else{
          console.log(sql + ' executed');
          // logger('info', sql + ' executed', customQuery);
          if(cb != null) cb(rows);
          return rows;
        }
      }
    );}
  });
}
module.exports.updateBarcodeCheckTime = updateBarcodeCheckTime;
module.exports.customQuery = customQuery;
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
module.exports.getPaymentCount = getPaymentCount;
module.exports.getNumberCount = getNumberCount;
