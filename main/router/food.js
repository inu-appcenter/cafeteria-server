const request = require('request');
const fs = require('fs');
const cafecode = require('../public/cafecode.json');
const util = require('util');
const path = require('path');
const moment = require('moment');
// const logger = require('./logger.js');

const time = ["", "조식", "중식", "석식"];

var makeResultName = function(no){
  return util.format('foodMenuType%sResult',no);
};

var makeConerName = function(code, no, time){
  no=no*1;
  var str;
  switch(code){
    case '0':
    str = no*1;
    break;
    case '1':
    str = String.fromCharCode(64 + no);
    break;
  }
  if(time) return util.format('%s코너(%s)',str,time);
  else return util.format('%s코너',str);
};

function food(req, res){
  var date = req.params.date;
  var type = req.params.type;
  console.log(type);  // TODO android, iOS 분리코드
  if(type == 'android'){
    fs.exists(path.join(__dirname, '../public/androidfood', date + '.json'), (exists) => {
      if(exists){
        res.json(require('../public/androidfood/' + date + '.json'));
        // res.json(fs.readFileSync(path.join(__dirname, '../public/androidfood', date), 'utf8'));
      }
      else {
        res.sendStatus(400);
      }
    });
  }
  else {
    fs.exists(path.join(__dirname, '../public/food', date + '.json'), (exists) => {
      if(exists){
        res.json(require('../public/food/' + date + '.json'));
        // res.json(fs.readFileSync(path.join(__dirname, '../public/food', date), 'utf8'));
      }
      else {
        res.sendStatus(400);
      }
    });
  }
  // console.log(date);
}

// TODO mode : android, iOS 분리코드
function getFoodPlan(date, mode){
  var options = {
    uri : 'https://sc.inu.ac.kr/inumportal/main/info/life/foodmenuSearch?stdDate=' + date,
    method : 'GET'
  };

  request(options, function(err, result){
    if(!err){
      var menus = [];
      var json = result.body;
      json = JSON.parse(json);
      // cafecode의 식당만 사용함.
      // cafecode의 menu값은 request해오는 결과의 번호.
      // type1은 코너 (1~5, A/B)
      // type2는 조/중/석식
      json.weekDay = json.dayOfWeekString;
      delete json.dayOfWeekString;
      delete json.afterDay;
      delete json.beforeDay;
      for(let i in cafecode){
        let menuNum = cafecode[i].menu;
        if(menuNum != -1){
          let conercheck = true;
          // TODO android, iOS 분리코드
          if(mode == 0){
            json[cafecode[i].no + ''] = json[makeResultName(menuNum)];
            menus = json[cafecode[i].no + ''];
          }
          else {
            json['cafe' + cafecode[i].no] = json[makeResultName(menuNum)];
            menus = json['cafe' + cafecode[i].no];
          }
          delete json[makeResultName(menuNum)];
          // menus = json[cafecode[i].no + ''];
          for(let j in menus){
            let menu = menus[j];
            if(menu.MENU == null){
              menu.MENU = "";
            }
            else {
              menu.MENU = menu.MENU.replace(/<span.*?>(.*?)<\/span>/gi,'$1');
              menu.MENU = menu.MENU.replace(/<hr(.*?)\/>/gi,'');
              menu.MENU = menu.MENU.replace(/amp;/gi,'');
            }
            delete menu.FOODMENU_TYPE;
            delete menu.STD_DATE;
            delete menu.FOODMENU_TYPE;
            delete menu.STD_DATE;
            let k = j*1+1;
            // console.log(menus[j]);
            if(menus[k]){
              if(menu.TYPE1 != menus[k].TYPE1) {
                conercheck = false;
              }
            }
            menu.TYPE2 = time[menu.TYPE2];
          }
          for(let j in menus){
            let menu = menus[j];
            if(conercheck){
              menu.TITLE = menu.TYPE2;
            }
            else {
              menu.TITLE = makeConerName(i, menu.TYPE1, menu.TYPE2);
            }
            delete menu.TYPE1;
            delete menu.TYPE2;
            menu.order = j;
          }
        }
      }
      // TODO android, iOS 분리코드
      var dir = '../public/';
      if(mode == 0){
        dir += 'food';
      }
      else {
        dir += 'androidfood';
      }
      fs.writeFile(path.join(__dirname, dir, date + '.json'), JSON.stringify(json,null,'\t'), function(err){
        if(!err){
          // logger('info','식단 저장 ' + date, getFoodPlan);
          // logger('telegram','식단 저장 ' + date, getFoodPlan);
        }
        else {
          // logger('error', err, getFoodPlan);
        }
      });
      // console.log(json);
      // return json;
    }
  });
}

function getFoodPlans(){
  var now = Date.now();
  var aDay = 86400000;
  var someday;
  for(var i = 0; i < 7; i++){
    someday = now + (aDay * i);
    // console.log(now + (aDay * i));
    var date = moment(someday).format('YYYYMMDD');
    // TODO android, iOS 분리코드
    getFoodPlan(date, 0);
    getFoodPlan(date, 1);
  }
}

// getFoodPlans();

module.exports={
  food,
  getFoodPlans
};
