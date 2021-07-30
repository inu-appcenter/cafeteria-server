/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2021 INU Global App Center <potados99@gmail.com>
 *
 * INU Cafeteria is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * INU Cafeteria is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {DiscountHistory, DiscountTransaction, User} from '@inu-cafeteria/backend-core';
import DiscountTransactionValidator, {
  ValidationResult,
} from '../../validation/DiscountTransactionValidator';
import logger from '../../../../common/logging/logger';

export default abstract class TransactionHandler {
  constructor(protected readonly transaction: DiscountTransaction) {}

  abstract taskType: 'Verify' | 'Confirm' | 'Cancel';
  abstract taskName: string;

  /**
   * 할인 Verify(바코드 처음 태그시), Confirm(결제시), Cancel(결제 취소시) 요청을 처리합니다.
   * 잘 처리되면 예외 없이 메소드가 종료됩니다.
   *
   * 만약 validation 과정에서 요청의 문제가 포착되면,
   * 후속 작업을 모두 마친 뒤에 해당 Error를 던집니다.
   *
   * 모든 할인 관련 요청은 성공 여부와 관계없이 영구히 기록됩니다.
   */
  async handle(): Promise<void> {
    logger.info(`${this.taskName}을 시작합니다.`);

    const {transaction} = this;
    const validator = new DiscountTransactionValidator({transaction});

    const {error, failedAt} = await this.validate(validator);

    if (error == null) {
      await this.onSuccess();
    } else {
      await this.onFail(failedAt);

      throw error;
    }
  }

  abstract validate(validator: DiscountTransactionValidator): Promise<ValidationResult>;

  private async onSuccess() {
    const {transaction, taskType, taskName} = this;
    const {studentId} = transaction;

    logger.info(`${studentId} ${taskName} 성공`);

    await this.leaveHistory(0, taskType);
  }

  private async onFail(failedAt: number) {
    const {transaction, taskType, taskName} = this;
    const {studentId} = transaction;
    const transactionString = JSON.stringify(transaction);

    logger.warn(`${studentId} ${taskName} 실패: 규칙 ${failedAt} 검증 실패: ${transactionString}`);

    await this.leaveHistory(failedAt, taskType, `${taskName} 실패: 규칙 ${failedAt} 검증 실패`);
  }

  private async leaveHistory(failedAt: number, taskType: string, message: string = '') {
    const {transaction} = this;
    const {studentId, cafeteriaId, mealType} = transaction;

    const history = DiscountHistory.create({
      type: taskType,
      user: await User.findOneOrFail({studentId}),
      cafeteriaId: cafeteriaId,
      mealType: mealType,
      failedAt: failedAt,
      message: message,
      timestamp: new Date(),
    });

    await history.save();
  }
}
