// 2017 동계 리뉴얼 bungabear6422@gmail.com 손민재

var ads;
var select;
var title;
var url;
var imageurl;
var image;
var contenets = [];
var form;
var subcount = 0;
var contnetsRow = 0;

$(function() {
  form = $('#form');
  select = $('#no');
  title = $('#title');
  url = $('#url');
  imageurl = $('#imageurl');
  image = $('#img');
  $.getJSON('/ads.json', function(data) {
    //data is the JSON string
    console.log(data);
    ads=data;
    for(var i=1; i <= ads.length; i++){
      select.append($('<option>', {
        value: i-1,
        text: ''+i
      }));
    }

    // url 파라미터 파싱.
    var item = 1;
    var url_string = window.location.href; //window.location.href
    var url = new URL(url_string);
    var c = url.searchParams.get("item");
    var error = url.searchParams.get("error");
    if(error == 'pw'){
      alert('비밀번호가 틀립니다.');
    }
    console.log(c);
    if(c) item = c;
    select.val(item-1);
    fillForm(item-1);
  });

  select.change(function() {
    // console.log($(this).val());
    fillForm($(this).val());
    console.log(form);
  });

  $('#add_content').click(function() {
    // if(contentsRow <= 5){
    subcount++;
    addContentRow(subcount, "", "");
    // }
    // else {
    // }
  });
});

function addContentRow(iter, subtitle, msg){
  if(contentsRow < 5){
    console.log(contentsRow);
    contentsRow++;
    $('#tbody').append("<tr id='tr" + iter + "'><td>항목<input type='input' id='subtitle" + iter + "' value='" + subtitle + "'><br>내용<textarea id='msg" + iter + "' rows='3' cols='50'>"+msg+"</textarea><input type='button' id='" + iter + "' value='삭제' onclick='deleteContentsRow(this.id)' ></td></tr>");
  }
  else {
    alert('5개 까지만 가능합니다.');
  }
}

function deleteAD(){
  var input = $("<input>")
  .attr("type", "hidden")
  .attr("name", "del").val("1");
  form.append(input);
  console.log(form);
  form.submit();
}

function deleteContentsRow(no){
  // deleteContentsRowByNo(button.id);
  var subtitle = $('#subtitle'+no);
  var msg = $('#msg'+no);
  contentsRow--;
  // console.log(subtitle.val() + ' : ' + msg.val());
  subtitle.val("");
  msg.val("");
  $('#tr' + no).remove();
}

function send(){
  // var contents = [];
  var subtitle;
  var msg;
  for(var i = 1 ; i <= subcount; i++){
    subtitle = $('#subtitle'+i).val();
    msg = $('#msg'+i).val();
    // console.log(subtitle + " : " + msg);
    if(msg || subtitle){
      form.append($('<input>')
      .attr("type", "hidden")
      .attr("name", "contents").val("{\"title\":\""+subtitle+"\", \"msg\":\""+msg+"\"}"));
    }
  }
  if(contentsRow<5){
    form.append($('<input>')
      .attr("type", "hidden")
      .attr("name", "contents").val("{\"title\":\"\", \"msg\":\"\"}"));
      contentsRow++;
  }
  if(contnetsRow<2){
    form.append($('<input>')
      .attr("type", "hidden")
      .attr("name", "contents").val("{\"title\":\"\", \"msg\":\"\"}"));
      contentsRow++;
  }
  form.submit();
}

function fillForm(no){
  for(var i = subcount; i > 0; i--){
    deleteContentsRow(i);
  }
  contentsRow=0;
  if(no > 4){
    alert("5개 까지만 가능합니다.");
  }
  else {
    title.val(ads[no].title);
    url.val(ads[no].url);
    if(ads[no].img != ''){
      imageurl.val('http://inucafeteriaaws.us.to:3829'+ads[no].img);
    }
    else {
      imageurl.val("");
    }
    image.attr("src",ads[no].img);
    // contenets.val(ads[no].);
    contents = ads[no].contents;
    for(subcount in contents){
      var subtitle = contents[subcount].title;
      var msg = contents[subcount].msg;
      subcount++;
      addContentRow(subcount, subtitle, msg);
    }
  }
}
