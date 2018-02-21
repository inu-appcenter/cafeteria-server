var mysql = require('./mysql.js');
var moment = require('moment');
var winston = require('winston');

var mysqld = require('mysql');
var dbconfig = require('../config.js').MYSQL_CONFIG;
var pool = mysqld.createPool(dbconfig);

function inquiredMsg(req, res, next){
  var id = req.query.id;
  var pw = req.query.pw;

  if(id == 'inu' && pw == 'cafe'){
    pool.getConnection(function(err, connection){
      if(err){
        console.log('[provider/inquireMsg] ERROR');
        res.json({'result':'error'});
      }
      var query = connection.query('select msg from error', function(err, rows, fields){
        if(!err){
          res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
          res.write('<h2>문의사항</h2>');
          res.write('<table>')

          for(var i in rows){
            var num = i;
            var msg = rows[i].msg;

            res.write('<tr>');
            res.write('<td>'+ num + ' : </td><td>' + msg + '</td>');
            res.write('</tr>');

          }
          res.write('</table>')
          res.end();
          return;
        }
        else{
          console.log('[provider/inquireMsg] DB_Connection_Select_ERROR');
          res.json({'result':'error'});
        }
      });
      connection.release();
    });
  }
  else{
    res.send('login error');
  }
}

function version(req, res, next){
	var version = require('../data/version.json');

	res.json(version);
}

module.exports.inquiredMsg = inquiredMsg;
module.exports.version = version;
