# cafeteria-server

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/inu-appcenter/cafeteria-server/Node.js%20CI)](https://github.com/inu-appcenter/cafeteria-server/actions?query=workflow%3A%22Node.js+CI%22)
[![GitHub last commit](https://img.shields.io/github/last-commit/inu-appcenter/cafeteria-server)](https://github.com/inu-appcenter/cafeteria-server/commits)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/inu-appcenter/cafeteria-server)](https://github.com/inu-appcenter/cafeteria-server/releases/latest)
[![GitHub stars](https://img.shields.io/github/stars/inu-appcenter/cafeteria-server?style=shield)](https://github.com/inu-appcenter/cafeteria-server/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/inu-appcenter/cafeteria-server)](https://github.com/inu-appcenter/cafeteria-server/issues)
![GitHub closed issues](https://img.shields.io/github/issues-closed/inu-appcenter/cafeteria-server)
[![GitHub license](https://img.shields.io/github/license/inu-appcenter/cafeteria-server)](https://github.com/inu-appcenter/cafeteria-server/blob/master/LICENSE)

**Cafeteria API 서버**

> #### Cafeteria 관련 저장소 일람
>
> ##### 서비스
> - **API 서버**: [cafeteria-server](https://github.com/inu-appcenter/cafeteria-server)
> - 모바일 앱: [cafeteria-mobile](https://github.com/inu-appcenter/cafeteria-mobile)
>
> ##### 운영 관리
> - 콘솔 API 서버: [cafeteria-console-server](https://github.com/inu-appcenter/cafeteria-console-server)
> - 콘솔 웹 인터페이스: [cafeteria-console-web](https://github.com/inu-appcenter/cafeteria-console-web)
>
> ##### 배포 관리
> - API 서버 배포 스크립트: [cafeteria-server-deploy](https://github.com/inu-appcenter/cafeteria-server-deploy)

## 개요

이 서버는 다음 API를 제공합니다.

### 클라이언트에게

- 식단 정보
- 식당 예약 
- 할인 멤버십
- 1:1 문의, 공지사항, FAQ 등

### 키오스크에게

- 결제시 할인 유효성 검증
- 결제시 할인 내역 등록

## 할인 비즈니스 룰

카페테리아 학생 할인을 제공받으려면 아래의 조건들을 만족해야 합니다:

- 1: requestShouldBeInMealTime
- 2: cafeteriaShouldSupportDiscount
- 3: userShouldExist
- 4: barcodeShouldBeActive
- 5: discountAtThisCafeteriaShouldBeFirstToday
- 6: barcodeShouldNotBeUsedRecently

## 설치

- [설치 및 배포 가이드](https://github.com/inu-appcenter/cafeteria-server-deploy)

## 업데이트 로그

### 2022.2.19 v2.3.8
- 의존성 hotfix.

### 2022.2.19 v2.3.6
- 공통 코드 backend-core로 이동.

### 2022.2.18 v2.3.5
- 예약 내역은 실시간 SSE로 받아볼 수 있게 함.

### 2022.2.16 v2.3.4
- `node-fetch` 스펙 변경 핫픽스.

### 2022.2.16 v2.3.3
- 취약 의존성 업데이트.

### 2021.11.14 v2.3.2
- 식단 파서가 `기타 정보`에 대해 규격을 준수하지 않는 문제 해결.

### 2021.10.18 v2.3.1
- 식단 파싱 규격 변경 (감사합니다 영양사님).
- 메뉴 캐시 삭제하는 엔드포인트 추가.

### 2021.10.11 v2.3.0
- 엔티티 복구 로직을 백엔드 코어에서 이 저장소로 이전.
- 공휴일인 경우 예약 옵션에서 제외.
- 예약 옵션 캐싱.

### 2021.10.8 v2.2.1
- 의존성 업데이트.

### 2021.10.7 v2.2.0
- 예약 관련 API 파라미터 이름 변경.

### 2021.10.5 v2.1.7
- 로그 누락 문제 해결.
- 예약 검증할 때에는 BookingOption 직접 가져와서 진행.

### 2021.10.5 v2.1.6
- 응답 메시지에서 개행문자 제거.

### 2021.10.5 v2.1.5
- 새 키오스크 API 성공시 body 규격 맞춤.

### 2021.10.5 v2.1.4
- 레거시 키오스크 API 파라미터 검증 lazy하게.

### 2021.10.5 v2.1.3
- 예약할 때 시간대 검증 오류 해결.

### 2021.10.5 v2.1.2
- 학번 로그인 API limit 해제.

### 2021.10.4 v2.1.1
- 답변 읽은 날짜 저장하는 부분 누락된 것 해결.

### 2021.10.3 v2.1.0
- 예약 시스템 준비 완료.
- 타임존 설정 환경변수로 오버라이드 가능하게 설정.

### 2021.10.3 v2.0.39
- 타임존 이슈 해결.

### 2021.10.3 v2.0.38
- 예약 시간대 표시 기준 변경.
- 아직 끝나지 않았으면 시작된 시간대도 표시.

### 2021.10.3 v2.0.37
- 코어 의존성 개행문자 따라붙는 버그 해결.

### 2021.10.2 v2.0.36
- 코어 의존성 버그 해결.

### 2021.10.2 v2.0.35
- Firebase admin 삭제.

### 2021.10.2 v2.0.34
- import 수정.

### 2021.10.2 v2.0.33
- 환경변수 중 일부는 secret에서 가져올 수 있게 함.

### 2021.10.2 v2.0.32
- Docker 배포 준비.

### 2021.9.30 v2.0.31
- 급한 버그 수정.

### 2021.9.30 v2.0.30
- 예약 시간대는 당일 또는 다음날만 보여줌. 보여줄 것이 없으면 보여주지 않음.

### 2021.9.28 v2.0.29
- 키오스크 API 개선.

### 2021.9.27 v2.0.28
- 학번으로 로그인 시 타임아웃 에러 다루는 부분 추가.

### 2021.9.27 v2.0.27
- 백엔드 코어 의존성 변경과 이에 대한 대응 적용.
- 동의 유효기한은 백엔드 코어에서 정함.

### 2021.9.25 v2.0.26
- SMS 발신번호 수정.
- SMSSender 로그 추가.

### 2021.9.25 v2.0.25
- 누락된 동의 28일 제한 config에 추가.

### 2021.9.25 v2.0.24
- 예약 가져올 때에는 최신 순으로 가져옴.

### 2021.9.25 v2.0.23
- 최근 예약 가져올 때에 relations가 빠진 코어 의존성 문제 해결.

### 2021.9.25 v2.0.22
- 예약 상태 3가지로 나누어 처리.
- 최근 72시간 예약 내역 표시.

### 2021.9.23 v2.0.21
- 개인정보 이용동의 여부 저장.
- 같은 식당 중복 예약 제한.

### 2021.9.17 v2.0.20
- 누락된 메일 알림 복귀.

### 2021.9.13 v2.0.19
- 관리자에게 보내는 메일에서, 사용자 질문에 답변하는 링크 수정.

### 2021.9.12 v2.0.18
- 코어 의존성 업데이트.

### 2021.9.11 v2.0.17
- 코어 의존성 업데이트.

### 2021.9.11 v2.0.16
- 로거와 rule validator 클래스를 backed core의 것으로 대체.
- 잘못 import된 MealType 수정.

### 2021.9.5 v2.0.15
- 누락된 markAnswerRead 추가.

### 2021.8.28 v2.0.14
- 코어 의존성 업데이트.

### 2021.8.28 v2.0.13
- 마지막 공지 가져오는 API 추가.
- 로그 확대.

### 2021.8.28 v2.0.12
- RuleChecker 구현에 끼어든 작은 버그 수정.
- RuleChecker 로그 출력 강화.

### 2021.8.23 v2.0.11
- 예약 찾는 함수에 인자 누락된 것 수정.

### 2021.8.23 v2.0.10
- 30분 정도 지난 예약도 표시는 해줌.

### 2021.8.23 v2.0.9
- 지나간 예약이 표시되는 문제를 해결한 backend-core 업데이트 적용.
- 오류 문구 수정.

### 2021.8.22 v2.0.8
- 애플 심사를 위한 테스트 계정 추가.

### 2021.8.22 v2.0.7
- 로그 남길 때에 body 원본 수정하는 문제 해결.

### 2021.8.22 v2.0.6
- API limit 완화.
- 로깅 강화

### 2021.8.21 v2.0.5
- 의존성 전체 업데이트.

### 2021.8.21 v2.0.4
- 의존성 안 쓰는 것 정리.

### 2021.8.21 v2.0.3
- 상태 체크 대응.

### 2021.8.21 v2.0.2
- tsc 의존성 제거.

### 2021.8.21 v2.0.1
- 누락된 의존성 tsc 추가.

### 2021.8.21 v2.0.0
- Typescript로 다시 작성.
- Express 사용.
- 예약 관련 기능 추가

### 2021.6.6 v1.9.0
- 보안 취약점 업데이트
- 문서에서 누락된 API 설명 추가
- 정적 호스팅 파일 제거(`cafeteria-in-app-web`으로 이전)
- 공지 노출 여부를 판단하기 위해 버전을 체크할 때에 `semver` 사용

### 2021.4.12 v1.8.0
- 할인 룰 5번 수정: `discountAtThisCafeteriaShouldBeFirstToday`

### 2021.4.1 v1.7.1
- 의존성 업데이트

### 2021.1.12 v1.7.0
- 카페테리아 Comment 추가

### 2021.1.9 v1.6.10
- `MealType` 규격 통일: 아침(4), 점심(2), 저녁(1) 사용

### 2021.1.7 v1.6.9
- axios 취약점 패치 적용

### 2021.1.4 v1.6.8
- 30분마다 현재부터 5일째까지 식단 가져옴

### 2021.1.4 v1.6.7
- 로그 포맷이 CloudWatch와 파일에서 다른 문제 해결

### 2021.1.4 v1.6.6
- 로그에 인스턴스 정보 표시

### 2021.1.4 v1.6.5
- AWS 설정 별도의 파일로 이동

### 2021.1.3 v1.6.4
- 문의 알림 메일에 담기는 콘솔 링크 변경

### 2020.12.31 v1.6.3
- 주문 상태 세분화
- 알림에 보내는 데이터 변경

### 2020.12.31 v1.6.2
- 대기중인 주문 삭제 안되는 버그 해결

### 2020.12.30 v1.6.1
- 식단 파싱할 때 날짜(weekdiff) 선정하는 문제 해결
- 의존성 보안 취약점 패치
- 30분마다 식단 파싱 및 오래된 주문 삭제

### 2020.12.30 v1.6.0
- 번호알림 지원
- DB 설정 명령어 지원 확대

### 2020.12.22 v1.5.7
- 식단 파싱할 때에 코너 이름을 느슨하게 비교하도록 변경

### 2020.12.19 v1.5.6
- 식단 파싱할 때에 빈 스트링이 걸러지지 않는 버그 제거
- DB 싱크 명령 추가

### 2020.12.9 v1.5.5
- IP 파악에 `X-Forwarded-For` 헤더 사용

### 2020.12.6 v1.5.4
- 사용자 에이전트 로깅
- 식단 배열로 제공하는 옵션 추가
- 식단 파싱할 때 날짜(`jun`) 문제 해결
- 긴 스트링에 TEXT 자료형 사용

### 2020.12.3 v1.5.3
- DB 인코딩 변경
- 문의 글자 수 제한 추가

### 2020.12.3 v1.5.2
- 문의 등록되면 관리자에게 알림 메일 발송

### 2020.12.2 v1.5.1
- 식단 파싱 버그 해결

### 2020.11.30 v1.5.0
- 고객센터 신설
- 타겟 공지 및 앱 업데이트 지원

### 2020.11.26 v1.4.3
- 사용자가 없으면 최근 바코드 태그된 적도 없는 것으로 간주함
- 바코드 파싱 후 정수로 변환

### 2020.11.26 v1.4.2
- `/isBarcode`와 `/paymentSend`에 적용되는 validation rule 각각 다르게 함
- 중복 로깅 문제 해결

### 2020.11.24 v1.4.1
- 사용자가 없는 상태에서도 transaction commit 가능해짐
- 바코드 태그시 모든 성공/실패 케이스에 TransactionHistory를 남김

### 2020.11.20 1.4.0
- 더 유연한 동작 가능
- DB 테이블 수정 및 추가

### 2020.10.25 v1.3.3
- 생협 홈페이지 리뉴얼로 인한 식단 파싱 문제 해결
- 식단 양식 대응

### 2020.10.20 v1.3.2
- Remember-me token으로 로그인할 수 없는 문제 해결

### 2020.9.19 v1.3.1
- 카페테리아 정보 요청시 500 에러 해결
- 응답 모델 문서 수정

### 2020.9.13 v1.3.0
- 식단 생협 홈페이지에서 직접 가져옴
- 코너에 조식/중식/석식 구분 추가

### 2020.4.24 v1.2.1
- 테스트 계정 추가
- 로그아웃 컨트롤러 500 버그 해결

### 2020.4.15 v1.2.0
- 로그인이 안 되는 심각한 버그 해결
- 광범위한 유닛 테스트 추가
- 도메인과 HTTPS 적용

### 2020.3.10 v1.1.3
- Notification API 이름 FeedbackReplies로 변경
- 내부 DB 구조 변경 (notifications -> feedback_replies, id와 feedback_id 추가)
- /isBarcode와 /paymentSend에 대응되는 입력 유효성 검사 로직 강화

### 2020.3.9 v1.1.2
- 도메인 엔티티 Cafeteria 확장
- 결제 유효성 검사에서 Cafeteria 할인 지원 여부 명시적으로 확인

### 2020.3.9 v1.1.1
- 로그인 시도시 응답 없는 경우 대응

### 2020.3.8 v1.1.0
- ES6 지원 추가, 클래스 기반으로 재설계
- 새로운 피드백과 답장 기능 추가
- 기존 API 모두 지원

### 2020.2.29 v1.0.0
- 최소 기능으로 새로운 시작 1.0.0 !!
- 실서버에 배포
- CI 테스트 적용

## 라이센스

소스 코드에는 GPLv3 라이센스가 적용됩니다. 라이센스는 [이곳](/LICENSE)에서 확인하실 수 있습니다.
