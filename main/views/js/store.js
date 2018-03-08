

// function(){
if( /Android/i.test(navigator.userAgent)) {
  // 안드로이드
  var locale = getLocale();
  if(locale == 'ko')
  {
    window.open('https://goo.gl/6TVgRC');
  }
  else {
    window.open('http://inucafeteriaaws.us.to:3829/INU Cafeteria.apk');
  }

} else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
  // iOS 아이폰, 아이패드, 아이팟
  window.location.href = 'https://goo.gl/jtRxnJ';
} else {
  // 그 외 디바이스
}

function getLocale() {

  if ( navigator ) {
    if ( navigator.language ) {
      return navigator.language;
    }
    else if ( navigator.browserLanguage ) {
      return navigator.browserLanguage;
    }
    else if ( navigator.systemLanguage ) {
      return navigator.systemLanguage;
    }
    else if ( navigator.userLanguage ) {
      return navigator.userLanguage;
    }
  }
}
