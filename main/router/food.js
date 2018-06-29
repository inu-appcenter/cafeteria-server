const request = require('request');
const fs = require('fs');
const cafecode = require('../public/cafecode.json');
const util = require('util');
const path = require('path');
const moment = require('moment');
// const logger = require('./logger.js');

const time = ["", "아침", "점심", "저녁"];

var makeResultName = function(no){
  // 'foodMenuType[no]Result'
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
  let date = req.params.date;
  let type = req.params.type;
  let url = req.originalUrl;
  console.log(url.split('/'));
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
  //return;
  // console.log(date);
}

// request wrapper function
function doRequest(options) {
  return new Promise(function (resolve, reject) {
    request(options, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

async function getFoodPlan(date, mode){
  let requset_options_smartcampus = {
    uri : 'https://sc.inu.ac.kr/inumportal/main/info/life/foodmenuSearch?stdDate=' + date,
    method : 'GET'
  };

  let request_options_tmp_menu_server = {
    uri : 'http://inucafeteriaaws.us.to:3829/test.json',
    method : 'GET'
  }

  // ---------------스캠 데이터 파싱 시작
  let smartcampus_food = await doRequest(requset_options_smartcampus);

  let menus = [];
  let json = smartcampus_food;
  json = JSON.parse(json);
  // cafecode의 식당만 사용함.
  // cafecode의 menu값은 request해오는 결과의 번호.
  // type1은 코너 (1~5, A/B)
  // type2는 조/중/석식
  json.weekDay = json.dayOfWeekString;

  // 불필요한 속성 삭제
  delete json.dayOfWeekString;
  delete json.afterDay;
  delete json.beforeDay;
  for(let i in cafecode){
    let menuNum = cafecode[i].menu;
    if(menuNum != -1 && json[[makeResultName(menuNum)]] != undefined ){
      let conercheck = true;
      // mode가 0이면 iOS, 1이면 Android용.
      // iOS는 json object이름으로 숫자만 주는데, Android는 Gson을 쓰느라 java 규칙에 어긋나 cafe+숫자 사용.
      //
      if(mode == 0){
        json[cafecode[i].no + ''] = json[makeResultName(menuNum)];
        menus = json[cafecode[i].no + ''];
      }
      else {
        json['cafe' + cafecode[i].no] = json[makeResultName(menuNum)];
        menus = json['cafe' + cafecode[i].no];
      }
      delete json[makeResultName(menuNum)];
      for(let j in menus){
        let menu = menus[j];
        // null, 태그 제거
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
        if(menus[k]){
          if(menu.TYPE1 != menus[k].TYPE1) {
            conercheck = false;
          }
        }
        menu.TYPE2 = time[menu.TYPE2];

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

      // 식단 Title 생성
      // for(let j in menus){
      //   let menu = menus[j];
      //
      // }
    } // menu num check if end
  } // cafecode for end



  // ---------------스캠 데이터 파싱 종료

  // ---------------메뉴 서버 데이터 추가
  // let menu_server_food = await doRequest(request_options_tmp_menu_server);
  // let parsed = JSON.parse(menu_server_food)
  // let number = 0;
  // let i = 11;
  // if(mode == 0){
  //   json[i + ''] = parsed;
  // }
  // else {
  //   json['cafe' + i] = parsed;
  // }


  // 파일로 저장
  var dir = '../public/';
  if(mode == 0){
    dir += 'food';
  }
  else {
    dir += 'androidfood';
  }
  fs.writeFile(path.join(__dirname, dir, date + '.json'), JSON.stringify(json,null,'\t'), function(err){
    if(err){
      logger('error', err, getFoodPlan);
    }
  });
}

getFoodPlan('20180101')

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
