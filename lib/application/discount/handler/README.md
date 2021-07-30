# Handler

**할인 요청 처리기**

## 개요

키오스크가 보낸 할인 요청은 모두 이 handler들로 전달됩니다.

유효성 검증과 기록을 포함해 할인 요청 처리에 필요한 모든 일을 처리합니다.

## 사용법

요청 유형(`Verify`, `Confirm`, `Cancel`)에 따라 적절한 `DiscountTransactionHandler`를 사용합니다.

```ts
// 바코드 찍을 때 보내는 요청에 사용.
await new VerifyHandler(transactionFromRequest).handle();

// 결제할 때 보내는 요청에 사용.
await new ConfirmHandler(transactionFromRequest).handle();

// 결제 취소할 때 보내는 요청에 사용.
await new CancelHandler(transactionFromRequest).handle();
```

## 수정

핵심 로직은 `base/DiscountTransactionHandler.ts`에 다 있습니다. 알아서 수정하세용!
