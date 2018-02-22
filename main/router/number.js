// copyright(c) 2017 All rights reserved by jaemoon(jjaemny@naver.com) 201201646 정보통신공학과 신재문

var express = require('express');
var morgan = require('morgan');
var asc = require('async');

// var http = require('http').Server(express);
// var io = require('socket.io')(http);
// var http = require('http');
var request = require('request');


var FCM = require('fcm-node');

var fcm = new FCM(require('../config.js').FCM_SERVER_KEY);
var mysql = require('mysql');
var dbconfig = require('../config.js').MYSQL_CONFIG;
var pool = mysql.createPool(dbconfig);

var mysqla = require('./mysql.js');


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
      res.send('err');
    }
    else {
      var tasks = [
        // function(callback){
        //   insertDB(connection, 'insert into number set?', {cafecode:code, token:token, ordernum:nums[i], device:device},callback);
        // }
      ];
      nums.map(function(num){tasks.push(function(callback){
        insertNumber(connection, 'insert into number set?', {cafecode:code, token:token, ordernum:num, device:device},callback);
      });});
      // for(var i in nums){
      //   var num = nums[i];
      //
      // }
      asc.series(tasks, function(err,results){
        connection.release();
        while(results.indexOf(0) >-1){
          results.splice(results.indexOf(0),1);
        }
        res.json({"cafecode":code,"token":token, "nums":results});
        if(results.length == 0) results = "nothing"
        console.log('[number/registerNumber] cafecode : ' + code + ', ' + results + ' registered.');
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
  });
}

// EDMS에서 번호 주는 함수
function pushNumber(req,res){
  var num = req.query.num;
  var code = req.query.code;
  var cafe = require('../public/cafecode.json');
  // console.log('[number/getPushNumber/params]' + code + ' ' + num );

  const options = {
    method : 'GET',
    uri : 'http://inucafeteriaaws.us.to:3829/socket?code='+code+'&num='+num
  }

  request(options,
    function (error, response, body){
      if(!error){
        console.log('[number/pushNumber/request] SUCCESS ' + body);
        // res.send(body);
      }
      else {
        console.log('[number/pushNumber] Error ' + error);
      }
    }
  );

    pool.getConnection(function(err, connection){
      if(err){
        console.log('[number/pushNumber] DB_Connection_Select_ERROR')
        res.json({'result':'error'});
      }
      var query = connection.query('select token, device from number where ordernum='+ num + ' and cafecode=' + code, function(err, rows, fields){
        if(!err){
          switch(rows.length){
            case 1:
              connection.release();
              var token = rows[0].token;
              var device = rows[0].device;
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
                  console.log('[number/pushNumber] FCM_ERROR');
                  res.json({'result':'ERROR'});
                  return;
                }
                console.log('[number/pushNumber] ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' | ' + restName[code-1] + ' : ' + num + '번 SUCCESS');
              });
              break;
            case 0:
              // console.log('[number/pushNumber] DB_Multiple_Result : ' + rows.length);
              break;
            default:
              console.log('[number/pushNumber] DB_Multiple_Result : ' + rows.length);
              break;
          }
          res.json({'result':'SUCCESS'});
        }
        else {
          console.log('[number/pushNumber] DB_Connection_ERROR');
          res.json({'result':'ERROR'});
        }
      });
    }
  );
}

function resetNumber(req, res){
  var fcmtoken = req.body.fcmtoken;
  pool.getConnection(function(err, connection){
    if(err){
      res.send('err');
    }
    else{
      connection.query('delete from number where token=\'' + fcmtoken + '\'' ,
      function(err, results){
        connection.release();
        if(err){
          if(typeof callback === 'fucntion') callback('err');
        } else{
          if(typeof callback === 'function') callback('suc');
        }
      }
    );}
    if(fcmtoken != null){
      console.log('[NUMBER/RESETNUMBER] SUCCESS');
      res.json({"result":"success"});
    } else{
      console.log('[NUMBER/RESETNUMBER] ERROR');
      res.json({"result":"error"});
    }
  });
}

module.exports.pushNumber = pushNumber;
module.exports.registerNumber = registerNumber;
module.exports.resetNumber = resetNumber;
