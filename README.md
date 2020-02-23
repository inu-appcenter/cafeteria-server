# INU-Cafeteria-Server

> 인천대학교 식단 정보 애플리케이션 INU Cafeteria (Server)

## 개요

![architecture](/docs/architecture.jpeg)
> \*1, \*2: 모바일 앱과 메인 서버의 통신. 식단, 로그인, 바코드.    
> \*3, \*4: 메인 서버에서 로그인 서버를 거쳐 자격 검증 및 세션 처리.    
> \*5, \*6: 메인 서버에서 스마트 캠퍼스 서버의 식단 정보 API 호출

이 서버는 다음 두 가지 역할을 수행합니다.

### 식단 정보 제공

[스마트 캠퍼스 식단정보](https://sc.inu.ac.kr/inumportal/main/info/life/foodmenuSearch?stdDate=20200219)로부터 식단 정보를 읽어 클라이언트에게 전달합니다.

### 로그인 및 바코드 생성, 관리

생협 학생할인 바코드 제공을 위한 로그인, 세션 및 바코드 활성화/비활성화 기능을 제공합니다.

## API

[API 문서](/docs/API.md)는 여기로.

## 기타

작성중...20200223
