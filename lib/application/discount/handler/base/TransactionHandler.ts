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

import {DiscountHistory, User} from '@inu-cafeteria/backend-core';
import DiscountTransactionValidator from '../../validation/DiscountTransactionValidator';
import {ValidationResult, ValidationResultCode} from '../../validation/errors/ValidationResult';
import logger from '../../../../common/logging/logger';
import {DiscountTransactionParams} from '../../base/Types';

export type TransactionHandlerParams = DiscountTransactionParams & {
  taskType: 'Verify' | 'Commit' | 'Cancel';
  taskName: string;
};

export default abstract class TransactionHandler {
  constructor(protected readonly params: TransactionHandlerParams) {}

  async handle() {
    const {transaction, transactionToken} = this.params;
    const validator = new DiscountTransactionValidator(transaction, transactionToken);

    const {code, failedAt} = await this.validate(validator);

    if (code === ValidationResultCode.USUAL_SUCCESS) {
      await this.onSuccess();
    } else {
      await this.onFail(failedAt);
    }
  }

  abstract validate(validator: DiscountTransactionValidator): Promise<ValidationResult>;

  private async onSuccess() {
    const {transaction, taskType, taskName} = this.params;
    const {studentId} = transaction;

    logger.info(`${studentId} ${taskName} 성공`);

    await this.leaveHistory(0, taskType);
  }

  private async onFail(failedAt: number) {
    const {transaction, taskType, taskName} = this.params;
    const {studentId} = transaction;
    const transactionString = JSON.stringify(transaction);

    logger.warn(`${studentId} ${taskName} 실패: 규칙 ${failedAt} 검증 실패: ${transactionString}`);

    await this.leaveHistory(failedAt, taskType, `${taskName} 실패: 규칙 ${failedAt} 검증 실패`);
  }

  private async leaveHistory(failedAt: number, taskType: string, message: string = '') {
    const {transaction} = this.params;
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
