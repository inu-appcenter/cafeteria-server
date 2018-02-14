// copyright(c) 2017 All rights reserved by jaemoon(jjaemny@naver.com) 201201646 정보통신공학과 신재문

var mysql = require('mysql');
var dbconfig = require('../info/mysqldbconfig.js');
var pool = mysql.createPool(dbconfig);

function putAuto(dtoken, sno, device){
  pool.getConnection(function(err, connection){
    if(err){
        res.send('err');
    }
    else{
      connection.query('insert into autologin set?',{"dtoken":dtoken,"student_no":sno,"device":device},
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

function makeZero(abc,token){
  pool.getConnection(function(err, connection){
    if(err){
        res.send('err');
    }
    else{
      connection.query('update number set num' + abc + ' =' + '\'' + -1 + '\'' + ' where token=\'' + token + '\'' + 'and flag=' + '\'' + 1 + '\'',
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

// function zeroBarcode(barcode){
//   pool.getConnection(function(err, connection){
//     if(err){
//         res.send('err');
//     }
//     else{
//       connection.query('update barcode set ch =' + 0 +  ' where barcode=' + barcode ,
//       function(err, results){
//         connection.release();
//         if(err){
//           if(typeof callback === 'fucntion') callback('err');
//         } else{
//           if(typeof callback === 'function') callback('suc');
//         }
//       }
//     )}
//   })
// }

function deleteDtoken(dtoken){
  pool.getConnection(function(err, connection){
    if(err){
        res.send('err');
    }
    else{
      connection.query('delete from autologin where dtoken=\'' + dtoken + '\'',
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

function deleteDtokenBySno(sno){
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

function updateBarcodeFlag(activeBarcode, barcode){
  pool.getConnection(function(err, connection){
    if(err){
        res.send('err');
    }
    else{
      connection.query('update barcode set flag =' + activeBarcode + ' where barcode=\'' + barcode + '\'',
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


function putBarcode(barcode){
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
          putBarcode(barcode);
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

function putError(sno,msg){
  pool.getConnection(function(err, connection){
    if(err){
        res.send('err');
    }
    else{
      connection.query('insert into error set?',{"stu_no":sno,"msg":msg},
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

module.exports.putAuto = putAuto;
module.exports.deleteDtoken = deleteDtoken;
module.exports.updateBarcodeFlag = updateBarcodeFlag;
module.exports.putBarcode = putBarcode;
module.exports.deleteBarcode = deleteBarcode;
module.exports.makeZero = makeZero;
module.exports.checkBarcode = checkBarcode;
module.exports.deleteDtokenBySno = deleteDtokenBySno;
module.exports.putError = putError;
// module.exports.zeroBarcode = zeroBarcode;
