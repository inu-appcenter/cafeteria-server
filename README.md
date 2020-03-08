# INU 카페테리아 서버

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/inu-appcenter/cafeteria-server/Node.js%20CI)](https://github.com/inu-appcenter/cafeteria-server/actions?query=workflow%3A%22Node.js+CI%22)
[![GitHub last commit](https://img.shields.io/github/last-commit/inu-appcenter/cafeteria-server)](https://github.com/inu-appcenter/cafeteria-server/commits)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/inu-appcenter/cafeteria-server)](https://github.com/inu-appcenter/cafeteria-server/releases/latest)
[![GitHub stars](https://img.shields.io/github/stars/inu-appcenter/cafeteria-server?style=shield)](https://github.com/inu-appcenter/cafeteria-server/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/inu-appcenter/cafeteria-server)](https://github.com/inu-appcenter/cafeteria-server/issues)
![GitHub closed issues](https://img.shields.io/github/issues-closed/inu-appcenter/cafeteria-server)
[![GitHub license](https://img.shields.io/github/license/inu-appcenter/cafeteria-server)](https://github.com/inu-appcenter/cafeteria-server/blob/master/LICENSE)

> 인천대학교 식단 정보 애플리케이션 INU Cafeteria (Server)

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
 └ deploy                           → 설치 및 배포 가이드, 스크립트
 └ docs                             → 문서
 └ lib                              → 애플리케이션 소스
    └ common   	                    → 애플리케이션 전역에서 쓰이는 객체
       └ di                         → 의존성 주입 클래스 선언과 모듈 정의
       └ utils                      → 유틸리티
    └ domain   	                    → 도메인 레이어 (엔터프라이즈 비즈니스 규칙과 애플리케이션 비즈니스 규칙을 통합)
       └ converter                  → 외부 모델을 도메인 모델로 바꾸어 주는 객체
       └ entities                   → 도메인 모델 (엔티티)
       └ repositories               → 데이터에 접근하는 객체의 인터페이스
       └ security                   → 인증 또는 개인정보과 관련된 객체
       └ serializer                 → 도메인 모델을 외부 응답 모델로 바꾸어 주는 객체
       └ usecases                   → 애플리케이션 비즈니스 규칙
       └ validators                 → 요청의 유효성을 검사하는 객체
    └ interfaces                    → 인터페이스 어댑터 레이어 (애플리케이션 비즈니스 규칙과 외부 레이어를 연결)
       └ controllers                → Hapi.js 라우터의 handler
       └ converter                  → converter 구현
       └ security                   → security 구현
       └ serializers                → serializer 구현
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

- [API 테스트](http://ec2-52-79-48-231.ap-northeast-2.compute.amazonaws.com:3829/documentation#/)

## 설치

- [설치 및 배포 가이드](/deploy) (우분투/데비안 계열 리눅스 환경 기준으로 작성되었습니다).

## 업데이트 로그

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
