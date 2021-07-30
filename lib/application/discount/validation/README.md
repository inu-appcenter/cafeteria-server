# Validation

**할인 승인 여부 검증기**

## 개요

학식당 키오스크로부터 수신한 할인 요청에 대한 유효성을 검증하는 `DiscountTransactionValidator`를 제공합니다.

## 사용법

먼저 `validator` 인스턴스를 만들어 줍니다. 검증에 필요한 `DiscountValidation` 객체는 알아서 만들어 줍니다.

```ts
const validator = new DiscountTransactionValidator({
  transaction: transactionFromRequest // 요청으로부터 생성한 DiscountTransaction.
});
```

용도에 따라 아래와 같이 구분해서 사용합니다.

```ts
// 바코드 찍을 때 보내는 요청에 사용.
await validator.validateForVerify();

// 결제할 때 보내는 요청에 사용.
await validator.validateForConfirm();

// 결제 취소할 때 보내는 요청에 사용.
await validator.validateForCancel(); 
```

## 수정

검증 룰은 `rules/DiscountRules.ts`에 정의되어 있으며, `rules/DiscountRulesChecker.ts`에 구현되어 있습니다. 알아서 바꾸세용!
