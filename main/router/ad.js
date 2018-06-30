var ads = require('../public/ads.json');
var fs = require('fs');
var path = require('path');
var im = require('imagemagick');
const multer = require('multer'); // multer모듈 적용 (for 파일업로드)
var AD_MANAGE_PW = require('../config.js').AD_MANAGE_PW;
const logger = require('./logger.js');

function adSet(req, res){
  var pw = req.body.pw;
  var del = req.body.del;
  var no = req.body.no;
  var title = req.body.title;
  var contents = req.body.contents;
  var img = req.body.img;
  var url = req.body.url;
  var file = req.file;
  var imagename;
  var ad = ads[no];
  var oldimage = ad.img;
  // console.log(req.body);
  if(pw != AD_MANAGE_PW){
    var item = no*1;
    item++;
    // logger('PASSWORD_ERROR');
    // console.log('[ad/adSet] PASSWORD_ERROR');
    res.redirect('/ads?item=' + item  + '&error=pw');
    return;
  }
  // 광고 삭제
  if(del == 1){
    ad.title = '';
    ad.url = '';
    ad.contents = [];
    if(ad.img){
      imgpath = path.join(__dirname, '../public', ad.img);
      fs.unlink(imgpath,
        function(err){
          if(err){
            logger('error', err, adSet);
          }
        }
      );
    }
    imgpath = path.join(__dirname, '../public', ad.previewimg);
    if(ad.previewimg){
      fs.unlinkSync(imgpath,
        function(err){
          if(err){
            logger('error', err, adSet);
          }
        }
      );
    }
    ad.previewimg = '';
    ad.img = '';
  }
  else {
    // 이미지 치환
    if(file){
      // console.log(req.file);
      imgname = req.file.filename;
      ad.img = '/image/' + imgname;
      // im.identify('../public' + ad.img, function(err, features){
      //   if (err){
      //     console.log(features);
      //   }
      //   else {
      //     console.log(err);
      //   }
      //   //   // { format: 'JPEG', width: 3904, height: 2622, depth: 8 }
      // });
      // im.resize({
      //   srcData: fs.readFileSync('kittens.jpg', 'binary'),
      //   width:   256
      // }, function(err, stdout, stderr){
      //   if (err) throw err
      //   fs.writeFileSync('kittens-resized.jpg', stdout, 'binary');
      //   console.log('resized kittens.jpg to fit within 256x256px')
      // });
      if(oldimage){
        fs.unlink(path.join(__dirname, '../public', oldimage),
        function(err){
          if(err){
            logger('error', err, adSet);
          }
        });
      }
    }
    ad.title = title;
    ad.url = url;
    // content escape문자 없도록 파싱
    var newcontents = [];
    contents.forEach(function(content){
      content = content.replace(/\r\n/gi,'\\r\\n');
      content = JSON.parse(content);
      var newcontent = {
        title:content.title,
        msg:content.msg
      };
      newcontents.push(newcontent);
    });
    ad.contents = newcontents;
  }
  var fd = fs.open(path.join(__dirname, '../public', 'ads.json'), "w",  function(err, fd){
    if(!err){
      fs.writeSync(fd, JSON.stringify(ads, null, '\t'), 0);
      logger('info', 'ad 수정 : ' + JSON.stringify(ad, null, '\t'), adSet);
    }
    else {
      logger('error', err, adSet);
    }
  });

  no++;
  res.redirect('/ads?item=' + no);
}

var upload = function(){
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/image/'); // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (req, file, cb) {
      // randtoken.generate(10);
      // TODO 파일 중복체크, 파일명 변경
      cb(null, new Date().valueOf() + path.extname(file.originalname)); // cb 콜백함수를 통해 전송된 파일 이름 설정
    }
  });
  return multer({ storage: storage });
};

module.exports = {
  adSet,
  upload
};
