// copyright(c) 2017 All rights reserved by jaemoon(jjaemny@naver.com) 201201646 정보통신공학과 신재문

var express = require('express');
var morgan = require('morgan');
// var http = require('http').Server(express);
// var io = require('socket.io')(http);
// var http = require('http');
var request = require('request');


var FCM = require('fcm-node');
var serverKey = "AAAAIzznl7Y:APA91bEuZwDP3ZDya5Xr4ndIDcwTKaXWpmIy43dD43UyjVzI2gNolKl_eB6OpEyZiy0OF-GUCAO-F8Ev7L1iFQnZEwTo-l3U038zcK9h8ZC1WCYfSygerTYM3ceNXTuDiybIpVJJSIyK"; //INU_Cafeteria serverKey
var fcm = new FCM(serverKey);
var mysql = require('mysql');
var dbconfig = require('../info/mysqldbconfig.js');
var pool = mysql.createPool(dbconfig);

var mysqla = require('./mysql.js');


function insertNum(code,token,num1,num2,num3,callback){
  pool.getConnection(function(err, connection){
    if(err){
        res.send('err');
    }
    else{
      connection.query('insert into number set?',{"code":code,"token":token,"num1":num1,"num2":num2,"num3":num3},
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


function pushNumber(req,res){
  var num = req.body.num;
  var code = req.body.code;

  // io.on('connection', function(socket){
  //   console.log('one user connected ' + socket.id);
  //   var socket = io.sockets.sockets;
  //   socket.forEach(function(sock){
  //       sock.emit('message',{num:num});
  //   })
  //   socket.on('disconnet', function(){
  //     console.log('one user disconneted ' + socket.id);
  //   })
  // })

  pool.getConnection(function(err, connection){
    if(err){
      res.send('mysql connection err');
    }
    var query = connection.query('select token,num1,num2,num3 from number where num1='+ num + ' and code=' + code + ' or num2='+ num + ' and code=' + code +' or num3=' + num + ' and code=' + code, function(err, rows, fields){
      if(!err){
        for(var i in rows){
          var tok = rows[i].token;
          var num1 = rows[i].num1;
          var num2 = rows[i].num2;
          var num3 = rows[i].num3;

          if(num1 == num){
            mysqla.makeZero(1,tok);
            num1 = -1;
          }
          if(num2 == num){
            console.log(num2);
            mysqla.makeZero(2,tok);
            num2 = -1;
            console.log(num2);
          }
          if(num3 == num){
            mysqla.makeZero(3,tok);
            num3 = -1;
          }

          if(num1 == -1 && num2 == -1 && num3 == -1){
            pool.getConnection(function(err, connection){
              if(err){
                  res.send('err');
              }
              else{
                connection.query('update number set flag =' + '\'' + 0 + '\'' + ' where token=\'' + tok + '\'' + 'and flag=' + 1  ,
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

          var data=req.body;
          var token = tok;
          var message = {
              to: token,
              priority : "high",
              notification: {
                  title: "INU_Cafeteria by 242", //title of notification
                  body: "Your food(" + num + ") is ready", //content of the notification
                  sound: "default",
                  icon: "ic_launcher", //default notification icon
              },
              data: data, //payload you want to send with your notification,
              time_to_live : 0
          };
          fcm.send(message, function(err, response){
              if (err) {
                  console.log("Notification not sent");
                  res.json({success:false})
              }
              console.log("주문번호 " + num + ", " + (Number(i)+1)+"개" +" response is successfully sent");
          });
        }
        res.json({token_number:(Number(i)+1)})
      }

      else{
        console.log('mysql query err');
      }
    });
    connection.release();
  });


}


function registerNumber(req, res, next){
  var code = req.body.code;
  var token = req.body.token;
  var num1 = req.body.num1;
  var num2 = req.body.num2;
  var num3 = req.body.num3;

  insertNum(code,token,num1,num2,num3,function(){
    res.json({"code":code,"token":token,"num1":num1,"num2":num2,"num3":num3})
    console.log(num1 + ' is registered.')
  });
}

function resetNumber(req, res, next){
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
    )}
    if(fcmtoken != null){
    console.log('[NUMBER/RESETNUMBER] SUCCESS');
    res.json({"result":"success"});
  } else{
    console.log('[NUMBER/RESETNUMBER] ERROR');
    res.json({"result":"error"});
  }
  })
}

function getCode(req, res, next){
  var json = require('./code.json');
  var version = require('../data/version.json');
  res.json({"code":json,"version":version});
}

// function temp(req,res){
//   var num = req.body.num;
//   // var code = req.body.code;
//   console.log('실험중');
//           var options = {
//             // url: 'https://fcm.googleapis.com/fcm/send',
//             url : 'http://117.16.231.66:829',
//             headers: {
//               'Authorization': 'key=' + serverKey
//             },
//             json: {
//
//               priority : "high",
//               notification: {
//                   title: "INU_Cafeteria by 242", //title of notification
//                   body: "Your food(is ready", //content of the notification
//                   sound: "default",
//                   icon: "ic_launcher", //default notification icon
//               }
//           }
//         }
//
//
//   request.post(options, function optionalCallback(err, httpResponse, body) {
//
//     if (err) {
//       return console.error('ERROR - FIREBASE POST failed:', err);
//     }
//
//     // Success
//
//   });
  // pool.getConnection(function(err, connection){
  //   if(err){
  //     res.send('mysql connection err');
  //   }
  //   var query = connection.query('select token from number where num1='+ num + ' or num2='+ num + ' or num3=' + num, function(err, rows, fields){
  //     if(!err){
  //       for(var i in rows){
  //         var tok = rows[i].token;
  //
  //         // var data=req.body;
  //         var token = tok;
  //         var message = {
  //             to: token,
  //             priority : "high",
  //             notification: {
  //                 title: "INU_Cafeteria by 242", //title of notification
  //                 body: "Your food(" + num + ") is ready", //content of the notification
  //                 sound: "default",
  //                 icon: "ic_launcher", //default notification icon
  //             },
  //             // data: data, //payload you want to send with your notification,
  //             // time_to_live : 0
  //         };
  //         console.log(tok);
  //         var clientToken= tok;
  //
  //         var options = {
  //           // url: 'https://fcm.googleapis.com/fcm/send',
  //           url : 'http://117.16.231.66:829',
  //           headers: {
  //             'Authorization': 'key=' + serverKey
  //           },
  //           json: {
  //             to: token,
  //             priority : "high",
  //             notification: {
  //                 title: "INU_Cafeteria by 242", //title of notification
  //                 body: "Your food(" + num + ") is ready", //content of the notification
  //                 sound: "default",
  //                 icon: "ic_launcher", //default notification icon
  //             }
  //         }
  //       }
  //
  //         request.post(options, function optionalCallback(err, httpResponse, body) {
  //
  //           if (err) {
  //             return console.error('ERROR - FIREBASE POST failed:', err);
  //           }
  //
  //           // Success
  //
  //         });
  //       }
  //       res.json({token_number:(Number(i)+1)})
  //     }
  //
  //     else{
  //       console.log('mysql query err');
  //     }
  //   });
  //   connection.release();
  // });
//
//
// }






module.exports.registerNumber = registerNumber;
module.exports.pushNumber = pushNumber;
module.exports.resetNumber = resetNumber;
module.exports.getCode = getCode;
// module.exports.temp = temp;
