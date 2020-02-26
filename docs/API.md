# API

## 식단

식단 API는 카페테리아, 코너, 메뉴 정보를 각각 제공합니다. 해당 정보들은 다음과 같은 의존성을 가집니다:

```
(독립) 카페테리아 <-- 코너 <-- 메뉴 (의존)
```

### cafeteria

**Method**: `GET`    
**URL**: `/cafeteria` 또는 `/cafeteria/:id`    
**Query**: 없음

모든 식당 목록 또는 하나의 식당을 가져옵니다. 식당은 다음 정보를 포함합니다:

- `id`: 식당의 식별자.
- `name`: 식당의 이름.
- `imagePath`: 식당 이미지 경로.
- `supportFoodMenu`: 식단 정보를 지원하는지 여부.
- `supportAlarm`: 번호알림을 지원하는지 여부.

모든 식당을 가져오기 위해 다음과 같이 사용할 수 있습니다.
~~~
GET /cafeteria

[
	{"id":"1","name":"복지회관 학생식당","imagePath":"/res/images/cafeteria-1.jpg","supportFoodMenu":"true","supportAlarm":"false"},
	{"id":"2","name":"카페테리아","imagePath":"/res/images/cafeteria-2.jpg","supportFoodMenu":"true","supportAlarm":"false"},
	{"id":"3","name":"사범대식당","imagePath":"/res/images/cafeteria-3.jpg","supportFoodMenu":"true","supportAlarm":"false"},
	{"id":"4","name":"생활관 기숙사식당","imagePath":"/res/images/cafeteria-4.jpg","supportFoodMenu":"true","supportAlarm":"false"},
	{"id":"5","name":"교직원식당","imagePath":"/res/images/cafeteria-5.jpg","supportFoodMenu":"true","supportAlarm":"false"}
]
~~~

또는 `id`가 2인 식당을 가져오기 위해 다음과 같이 요청할 수 있습니다.

~~~
GET /cafeteria/2

{"id":"2","name":"카페테리아","imagePath":"/res/images/cafeteria-2.jpg","supportFoodMenu":"true","supportAlarm":"false"}
~~~

### corner

**Method**: `GET`    
**URL**: `/corner` 또는 `/corner/:id`    
**Query**: (선택)`cafeteriaId`

모든 코너의 목록 또는 하나의 코너를 가져옵니다. 코너는 다음 정보를 포함합니다:

- `cafeteriaId`: 해당 코너가 속한 식당의 식별자.
- `id`: 코너의 식별자
- `name`: 코너의 이름.

모든 코너를 가져오기 위해 다음과 같이 요청할 수 있습니다.

~~~
GET /corner

[
	{"cafeteriaId":"1","id":"1","name":"1코너 점심(앞쪽)"},
	{"cafeteriaId":"1","id":"2","name":"1코너 저녁(앞쪽)"},
	...(중략)...
	{"cafeteriaId":"5","id":"17","name":"점심"},
	{"cafeteriaId":"5","id":"18","name":"저녁"}
]
~~~

만약 `id`가 2인 코너만 가져오고 싶다면 아래와 같이 요청합니다.

~~~
GET /corner/2

{"cafeteriaId":"1","id":"2","name":"1코너 저녁(앞쪽)"}
~~~

식별자가 3인 식당에 속하는 코너만 가져오고 싶다면 쿼리 파라미터로 `cafeteriaId`를 지정합니다.

~~~
GET /corner?cafeteriaId=3

[
	{"cafeteriaId":"3","id":"12","name":"점심"},
	{"cafeteriaId":"3","id":"13","name":"저녁"}
]
~~~

`id`와 `cafeteriaId`를 모두 지정할 수도 있습니다.    
이렇게 하면 두 조건이 모두 일치하는 경우가 아닐 때에 `Bad Request` 응답을 받게 됩니다.    
이 경우에서의 응답은 성공적일 경우 `id`만 지정한 것과 완전히 같습니다.

아래 두 요청의 결과는 완전히 같습니다.

~~~
GET /corner/12?cafeteriaId=3

{"cafeteriaId":"3","id":"12","name":"점심"}
~~~

~~~
GET /corner/12

{"cafeteriaId":"3","id":"12","name":"점심"}
~~~

만약 두 조건이 상충한다면 실패합니다.

~~~
GET /corner/9?cafeteriaId=1

Bad Request
~~~

### menu

**Method**: `GET`    
**URL**: `/menu`    
**Query**: (선택)`cornerId`, (선택)`date`

모든 메뉴 목록 또는 하나의 메뉴를 가져옵니다. 메뉴는 다음 정보를 포함합니다:

- `cornerId`: 해당 메뉴를 제공하는 코너의 식별자.
- `foods`: 메뉴 정보.
- `price`: 메뉴의 가격.
- `calorie`: 메뉴의 열량.

모든 메뉴를 가져오기 위해 다음과 같이 요청할 수 있습니다.

~~~
GET /menu

[
	{"cornerId":"1","foods":"육개장*당면사리비엔나간장조림숙주나물 호박나물 쌀밥","price":"3500","calorie":"776"},
	{"cornerId":"2","foods":"뚝배기치즈닭갈비무간장조림 마카로니샐러드 유부장국 쌀밥","price":"3500","calorie":"796"},
	...(중략)...
	{"cornerId":"17","foods":"오삼불고기 미역국 메추리알비엔나조림 들깨무나물 오이무추무침 모듬쌈*쌈장 포기김치/흑미밥","price":"5500","calorie":"801"},
	{"cornerId":"18","foods":"짜장잡채밥*군만두 미역국 꽃빵연유튀김 떡갈비야채볶음 시금치나물 단무치무침 포기김치","price":"5500","calorie":"816"}
]
~~~

코너와 날짜를 지정할 수 있습니다.

`cornerId`를 사용해 코너를 지정합니다.

~~~
GET /menu?cornerId=12

[
	{"cornerId":"12","foods":"장조림버터볶음밥 치킨텐더샐러드 열무된장국 매콤소스꼬치어묵 숙주나물무침 설탕토마토 고추지무침 배추김치","price":"5500","calorie":"677"},
	{"cornerId":"12","foods":"순대국밥/수육국밥 [부추+양파절임+김치+밥]","price":"5500","calorie":null},
	{"cornerId":"12","foods":"셀프라면","price":"2000","calorie":null}
]
~~~

> 하나의 코너에도 여러 개의 메뉴가 존재할 수 있는 점에 주의해야 합니다.

`date`를 사용해 날짜를 지정합니다. 날짜의 포맷은 `yyyymmdd`입니다.

예를 들어, 2020년 2월 11일 사범대식당 중식(`id` 12) 식단을 조회하고 싶다면 다음과 같이 요청합니다.
~~~
GET /menu?cornerId=12&date=20200211

[
	{"cornerId":"12","foods":"매콤닭봉조림 불고기파스타 유부장국 감자튀김*케찹 건파래볶음 오이지무침 배추김치 흑미밥","price":"5500","calorie":"675"},
	{"cornerId":"12","foods":"순대국밥/수육국밥 [부추+양파절임+김치+밥]","price":"5500","calorie":null},
	{"cornerId":"12","foods":"셀프라면","price":"2000","calorie":null}
]
~~~

## 로그인

작성중...20200223
