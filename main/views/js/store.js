

// function(){
  if( /Android/i.test(navigator.userAgent)) {
  // 안드로이드
  window.location.href = 'https://play.google.com/store/apps/details?id=com.inu.cafeteria';
} else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
  // iOS 아이폰, 아이패드, 아이팟
  window.location.href = 'https://itunes.apple.com/kr/app/inu-%EC%B9%B4%ED%8E%98%ED%85%8C%EB%A6%AC%EC%95%84/id1272600111?mt=8';
} else {
  // 그 외 디바이스
  window.location.href = 'https://play.google.com/store/apps/details?id=com.inu.cafeteria';
}
// }


// 출처: http://webinformation.tistory.com/14 [끄적끄적]
