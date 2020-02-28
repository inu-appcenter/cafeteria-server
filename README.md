# INU 카페테리아 서버

> 인천대학교 식단 정보 애플리케이션 INU Cafeteria (Server)

## 개요

![architecture](/docs/architecture.jpeg)
> \*1, \*2: 모바일 앱과 메인 서버의 통신. 식단, 로그인, 바코드.    
> \*3, \*4: 메인 서버에서 로그인 서버를 거쳐 자격 검증 및 세션 처리.    
> \*5, \*6: 메인 서버에서 스마트 캠퍼스 서버의 식단 정보 API 호출

이 서버는 다음 두 가지 역할을 수행합니다.

- 식단 정보 제공
- 로그인 및 바코드 생성, 관리

## 상세

이 애플리케이션은 밥아저씨의 [클린 아키텍쳐](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) 원칙을 준수합니다.

### 디렉토리 구조

~~~
app
 └ config                           → 설정 파일
 └ deploy                           → 설정 및 배포 가이드, 스크립트
 └ docs                             → 문서
 └ lib                              → 애플리케이션 소스
    └ common   	                    → 애플리케이션 전역에서 쓰이는 객체 (로깅, 암호화 등)
    └ domain   	                    → 도메인 레이어 (엔터프라이즈 비즈니스 규칙과 애플리케이션 비즈니스 규칙을 통합)
	   └ converter                  → 외부 모델을 도메인 모델로 바꾸어 주는 객체
	   └ entities                   → 도메인 모델 (엔티티)
       └ repositories               → 데이터에 접근하는 객체의 인터페이스
	   └ serializer                 → 도메인 모델을 외부 응답 모델로 바꾸어 주는 객체.
       └ usecases                   → 애플리케이션 비즈니스 규칙
    └ infrastructure                → 프레임워크, 드라이버 (DB, 웹서버 등)
       └ database                   → ORM과 DB 연결 객체
	   └ network                    → 네트워크 API (fetch)
       └ webserver                  → Hapi.js 웹 서버 구성 (서버, 라우터, 플러그인 등)
          └ server.js               → Hapi.js 서버 정의
    └ interfaces                    → 인터페이스 어댑터 레이어 (애플리케이션 비즈니스 규칙과 외부 레이어를 연결)
       └ controllers                → Hapi.js 라우터의 handler
	   └ converter                	→ converter 구현
       └ serializers                → serializer 구현
       └ storage                    → repository 구현
 └ public                           → 웹 서버에 의해 public으로 제공되는 파일들 (res/images 등)
 └ test                             → 테스트 소스
 └ index.js                         → 메인 애플리케이션 진입점
~~~

## API

- [API 문서](/docs/API.md)

- [API 테스트](http://ec2-52-79-48-231.ap-northeast-2.compute.amazonaws.com:4869/documentation#/)

## 설치

- [설치 및 배포 가이드](/deploy) (우분투/데비안 계열 리눅스 환경 기준으로 작성되었습니다).

## 업데이트 로그

### 2020.2.29 v1.0.0
- 새로운 시작 1.0.0 !!
- 실서버에 배포
- CI 테스트 적용

## 라이센스

소스 코드에는 GPLv3 라이센스가 적용됩니다. 라이센스는 [이곳](/LICENSE)에서 확인하실 수 있습니다.

## 스페셜 땡스 투

- 좋은 [레퍼런스](https://github.com/jbuget/nodejs-clean-architecture-app) 제공해주신 [Jérémy Buget](https://github.com/jbuget)님
- 바쁘신 와중에도 큰 도움 주신 [doukong](https://github.com/doukong)님
- 먼저 왔다 가신 jaemoon님, [Minjae Son](https://github.com/bungabear)님, jongwook님
