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
> - Android 앱: [cafeteria-android](https://github.com/inu-appcenter/cafeteria-android)
>
> ##### 운영 관리
> - 관리용 API 서버: [cafeteria-management-server](https://github.com/inu-appcenter/cafeteria-management-server)
> - 웹 콘솔: [cafeteria-management-web](https://github.com/inu-appcenter/cafeteria-management-web)
>
> ##### 배포 관리
> - API 서버 배포 스크립트: [cafeteria-server-deploy](https://github.com/inu-appcenter/cafeteria-server-deploy)

## 개요

![architecture](/docs/architecture.jpeg)

이 서버는 다음 API를 제공합니다.

### 클라이언트에게

- 식단 정보 제공
- 할인 바코드 제공
- 피드백 수신, 답장과 공지사항 제공

### 생협에게

- 결제시 할인 유효성 검증
- 결제시 할인 내역 등록

## 상세

이 애플리케이션은 밥아저씨의 "[Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)"를 준수합니다. ~~아닐 수도 있음 :D~~

### 디렉토리 구조

~~~
app
 └ docs                             → 문서
 └ lib                              → 애플리케이션 소스
    └ common   	                    → 애플리케이션 전역에서 쓰이는 객체
       └ di                         → 의존성 주입 클래스 선언과 모듈 정의
       └ utils                      → 유틸리티
    └ domain   	                    → 도메인 레이어 (엔터프라이즈 비즈니스 규칙과 애플리케이션 비즈니스 규칙을 통합)
       └ constants                  → 상수 정의
       └ entities                   → 도메인 모델 (엔티티)
       └ repositories               → 데이터에 접근하는 객체의 인터페이스
       └ security                   → 인증 또는 개인정보과 관련된 객체
       └ services                   → controller와 repository 사이의 도메인 로직을 처리하는 객체
       └ usecases                   → 애플리케이션 비즈니스 규칙
       └ validators                 → 요청의 유효성을 검사하는 객체
    └ interfaces                    → 인터페이스 어댑터 레이어 (애플리케이션 비즈니스 규칙과 외부 레이어를 연결)
       └ controllers                → Hapi.js 라우터의 handler
       └ converter                  → 외부 모델을 도메인 모델로 바꾸어 주는 객체
       └ security                   → security 구현
       └ serializers                → 도메인 모델을 외부 응답 모델로 바꾸어 주는 객체
       └ services                   → services 구현
       └ storage                    → repository 구현
       └ validators                 → validators 구현
    └ infrastructure                → 프레임워크, 드라이버 (DB, 웹서버 등)
       └ database                   → ORM과 DB 연결 객체
       └ webserver                  → Hapi.js 웹 서버 구성 (서버, 라우터, 플러그인 등)
       └ server.mjs                 → Hapi.js 서버 정의
 └ public                           → 웹 서버에 의해 public으로 제공되는 파일들 (res/images 등)
 └ test                             → 테스트 소스
    └ integration                   → 통합 테스트
    └ mocks                         → 테스트용으로 구현한 목(mock) 소스 파일
    └ unit                          → 유닛 테스트
 └ index.mjs                        → 메인 애플리케이션 진입점
 └ config.mjs                       → 설정 파일
~~~

## API

- [API 문서](/docs/API.md)

- [API 테스트](https://api.inu-cafeteria.app/documentation)

## 비즈니스 룰

카페테리아 학생 할인을 제공받으려면 아래의 조건들을 만족해야 합니다:

- 1: requestShouldBeInMealTime
- 2: cafeteriaShouldSupportDiscount
- 3: userShouldExist
- 4: barcodeShouldBeActive
- 5: discountShouldBeFirstToday
- 6: barcodeShouldNotBeUsedRecently
- 7: tokenShouldBeValid

## 설치

- [설치 및 배포 가이드](https://github.com/inu-appcenter/cafeteria-server-deploy)

## 업데이트 로그

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

## 스페셜 땡스 투

- 좋은 [레퍼런스](https://github.com/jbuget/nodejs-clean-architecture-app) 제공해주신 [Jérémy Buget](https://github.com/jbuget)님
- 바쁘신 와중에도 큰 도움 주신 [doukong](https://github.com/doukong)님, [Gowoon Jung](https://github.com/GowoonJ)님
- 먼저 왔다 가신 jaemoon님, [Minjae Son](https://github.com/bungabear)님, jongwook님
