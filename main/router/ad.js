var ads = require('../public/ads.json');
var fs = require('fs');
var path = require('path');

function adSet(req, res){
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
  // 광고 삭제
  if(del == 1){
    ad.title = '';
    ad.url = '';
    ad.contents = [];
    if(ad.img)
      fs.unlinkSync(path.join(__dirname, '../public', ad.img));
    ad.img = '';
  }
  else {
    // 이미지 치환
    if(file){
      imgname = req.file.filename;
      ad.img = '/image/' + imgname;
      if(oldimage){
        fs.unlinkSync(path.join(__dirname, '../public', oldimage));
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
      console.log('[ad/adSet] ad 수정 : ' + JSON.stringify(ad, null, '\t'));
    }
    else {
      console.log(err);
    }
  });

  no++;
  res.redirect('/ads?item=' + no);
}

module.exports.adSet = adSet;
