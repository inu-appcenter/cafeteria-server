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

## 비즈니스 룰

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
