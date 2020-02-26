# 카페테리아 서버 API
## Version: 0.1.0

### /cafeteria

#### GET
##### Summary:

모든 Cafeteria의 배열을 요청합니다.

##### Description:

cafeteria 테이블의 열을 모두 읽은 뒤 직렬화하여 전달합니다.

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful | [Model1](#model1) |
| 400 | Bad Request | [Boom%20%EC%98%A4%EB%A5%98%20%EB%AA%A8%EB%8D%B8](#boom%20%ec%98%a4%eb%a5%98%20%eb%aa%a8%eb%8d%b8) |
| 500 | Internal Server Error | [Boom%20%EC%98%A4%EB%A5%98%20%EB%AA%A8%EB%8D%B8](#boom%20%ec%98%a4%eb%a5%98%20%eb%aa%a8%eb%8d%b8) |

### /corners

#### GET
##### Summary:

모든 Corner의 배열을 요청합니다.

##### Description:

corners 테이블의 열을 모두 읽은 뒤 직렬화하여 전달합니다.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| cafeteriaId | query | 해당 Corner가 속한 Cafeteria의 id | No | number |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful | [Model2](#model2) |
| 400 | Bad Request | [Boom%20%EC%98%A4%EB%A5%98%20%EB%AA%A8%EB%8D%B8](#boom%20%ec%98%a4%eb%a5%98%20%eb%aa%a8%eb%8d%b8) |
| 500 | Internal Server Error | [Boom%20%EC%98%A4%EB%A5%98%20%EB%AA%A8%EB%8D%B8](#boom%20%ec%98%a4%eb%a5%98%20%eb%aa%a8%eb%8d%b8) |

### /menus

#### GET
##### Summary:

Menu를 요청합니다.

##### Description:

스마트 캠퍼스 서버로부터 주어진 날짜의 식단 정보를 요청하여 가공한 뒤 직렬화하여 전달합니다.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| date | query | 가져오고자 하는 Menu들의 날짜 | No | string |
| cornerId | query | 가져오고자 하는 Menu들이 속한 Corner의 id. 특정 코너의 식단만 가져오고 싶을 때에 유용합니다. | No | number |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful | [Model3](#model3) |
| 400 | Bad Request | [Boom%20%EC%98%A4%EB%A5%98%20%EB%AA%A8%EB%8D%B8](#boom%20%ec%98%a4%eb%a5%98%20%eb%aa%a8%eb%8d%b8) |
| 500 | Internal Server Error | [Boom%20%EC%98%A4%EB%A5%98%20%EB%AA%A8%EB%8D%B8](#boom%20%ec%98%a4%eb%a5%98%20%eb%aa%a8%eb%8d%b8) |

### /cafeteria/{id}

#### GET
##### Summary:

지정된 id를 가지는 Cafeteria를 요청합니다.

##### Description:

cafeteria 테이블에서 주어진 id를 가지는 열을 읽은 뒤 직렬화하여 전달합니다.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | Cafeteria의 id. | Yes | number |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful | [Cafeteria%20%EB%AA%A8%EB%8D%B8](#cafeteria%20%eb%aa%a8%eb%8d%b8) |
| 400 | Bad Request | [Boom%20%EC%98%A4%EB%A5%98%20%EB%AA%A8%EB%8D%B8](#boom%20%ec%98%a4%eb%a5%98%20%eb%aa%a8%eb%8d%b8) |
| 500 | Internal Server Error | [Boom%20%EC%98%A4%EB%A5%98%20%EB%AA%A8%EB%8D%B8](#boom%20%ec%98%a4%eb%a5%98%20%eb%aa%a8%eb%8d%b8) |

### /corners/{id}

#### GET
##### Summary:

지정된 id를 가지는 Corner를 요청합니다.

##### Description:

corners 테이블에서 주어진 id를 가지는 열을 읽은 뒤 직렬화하여 전달합니다.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | Corner의 id. | Yes | number |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful | [Corner%20%EB%AA%A8%EB%8D%B8](#corner%20%eb%aa%a8%eb%8d%b8) |
| 400 | Bad Request | [Boom%20%EC%98%A4%EB%A5%98%20%EB%AA%A8%EB%8D%B8](#boom%20%ec%98%a4%eb%a5%98%20%eb%aa%a8%eb%8d%b8) |
| 500 | Internal Server Error | [Boom%20%EC%98%A4%EB%A5%98%20%EB%AA%A8%EB%8D%B8](#boom%20%ec%98%a4%eb%a5%98%20%eb%aa%a8%eb%8d%b8) |

### /login

#### POST
##### Summary:

로그인을 요청합니다.

##### Description:

카페테리아 할인 대상자 여부를 판단하여 로그인을 처리합니다.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| body | body |  | No | [Login%20%ED%8C%8C%EB%9D%BC%EB%AF%B8%ED%84%B0%20%EB%AA%A8%EB%8D%B8](#login%20%ed%8c%8c%eb%9d%bc%eb%af%b8%ed%84%b0%20%eb%aa%a8%eb%8d%b8) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful | [User%20%EB%AA%A8%EB%8D%B8](#user%20%eb%aa%a8%eb%8d%b8) |
| 400 | Bad Request | [Boom%20%EC%98%A4%EB%A5%98%20%EB%AA%A8%EB%8D%B8](#boom%20%ec%98%a4%eb%a5%98%20%eb%aa%a8%eb%8d%b8) |
| 401 | Unauthorized | [Boom%20%EC%98%A4%EB%A5%98%20%EB%AA%A8%EB%8D%B8](#boom%20%ec%98%a4%eb%a5%98%20%eb%aa%a8%eb%8d%b8) |
| 403 | Forbidden | [Boom%20%EC%98%A4%EB%A5%98%20%EB%AA%A8%EB%8D%B8](#boom%20%ec%98%a4%eb%a5%98%20%eb%aa%a8%eb%8d%b8) |
| 500 | Internal Server Error | [Boom%20%EC%98%A4%EB%A5%98%20%EB%AA%A8%EB%8D%B8](#boom%20%ec%98%a4%eb%a5%98%20%eb%aa%a8%eb%8d%b8) |

### /logout

#### POST
##### Summary:

로그아웃을 요청합니다.

##### Description:

세션을 종료합니다.

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful | string |
| 401 | Unauthorized | [Boom%20%EC%98%A4%EB%A5%98%20%EB%AA%A8%EB%8D%B8](#boom%20%ec%98%a4%eb%a5%98%20%eb%aa%a8%eb%8d%b8) |
| 500 | Internal Server Error | [Boom%20%EC%98%A4%EB%A5%98%20%EB%AA%A8%EB%8D%B8](#boom%20%ec%98%a4%eb%a5%98%20%eb%aa%a8%eb%8d%b8) |

### Models


#### Cafeteria 모델

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | number | Cafeteria의 id | No |
| name | string | Cafeteria의 이름 | No |
| image-path | string | Cafeteria 이미지 경로 | No |

#### Model1

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| Model1 | array |  |  |

#### Boom 오류 모델

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| statusCode | number | HTTP 상태 코드 | No |
| error | string | HTTP 에러 이름 | No |
| message | string | 메시지 | No |

#### Corner 모델

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | number | Corner의 id | No |
| name | string | Corner의 이름 | No |
| cafeteria-id | number | Corner가 속한 Cafeteria의 id | No |

#### Model2

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| Model2 | array |  |  |

#### Menu 모델

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| corner-id | number | 해당 메뉴가 존재하는 코너의 id | No |
| foods | string | 공백 문자로 구분된 식단 소메뉴 | No |
| price | number | 가격 | No |
| calorie | number | 열량(kcal) | No |

#### Model3

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| Model3 | array |  |  |

#### Login 파라미터 모델

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| token | string | 토큰 | No |
| id | string | 학번 | No |
| password | string | 비밀번호 | No |

#### User 모델

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | number | 학번 | No |
| token | string | 로그인 토큰 | No |
| barcode | string | 학생할인 바코드 | No |