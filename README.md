# INU-Cafeteria-Server

> 인천대학교 식단 정보 애플리케이션 INU Cafeteria (Server)

## 개요

![architecture](/docs/architecture.jpeg)
> \*1, \*2: 모바일 앱과 메인 서버의 통신. 식단, 로그인, 바코드.    
> \*3, \*4: 메인 서버에서 로그인 서버를 거쳐 자격 검증 및 세션 처리.    
> \*5, \*6: 메인 서버에서 스마트 캠퍼스 서버의 식단 정보 API 호출

이 서버는 다음 두 가지 역할을 수행합니다.

- 식단 정보 제공
- 로그인 및 바코드 생성, 관리

## API

API 문서는 [여기](/docs/API.md)로.

API 테스트는 [여기](http://ec2-52-79-48-231.ap-northeast-2.compute.amazonaws.com:9999/documentation#/)로.

## 설치

[Deploy](/deploy) 참조.

## 라이센스

`GPLv3`
