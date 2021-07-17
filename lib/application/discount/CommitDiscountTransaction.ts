/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020 INU Global App Center <potados99@gmail.com>
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

import UseCase from '../../common/base/UseCase';
import {Cafeteria, DiscountHistory, DiscountTransaction, User} from '@inu-cafeteria/backend-core';
import DiscountTransactionValidator from './validation/DiscountTransactionValidator';
import {ValidationResultCode} from './validation/ValidationResult';
import logger from '../../common/logging/logger';

export type CommitDiscountTransactionParams = {
  transaction: DiscountTransaction;
  transactionToken: string;
  confirm: boolean;
};

class CommitDiscountTransaction extends UseCase<CommitDiscountTransactionParams, void> {
  async onExecute(params: CommitDiscountTransactionParams): Promise<void> {
    if (params.confirm) {
      await this.doFor(params, 'Commit', '할인 트랜잭션 확정');
    } else {
      await this.doFor(params, 'Cancel', '할인 트랜잭션 취소');
    }
  }

  private async doFor(params: CommitDiscountTransactionParams, type: string, description: string) {
    const {transaction, transactionToken} = params;

    const {code, failedAt} = await new DiscountTransactionValidator(
      transaction,
      transactionToken
    ).validateForCancel();

    if (code === ValidationResultCode.USUAL_SUCCESS) {
      await this.onSuccess(params, type, description);
    } else {
      await this.onFail(params, failedAt, type, description);
    }
  }

  private async onSuccess(
    {transaction}: CommitDiscountTransactionParams,
    type: string,
    description: string
  ) {
    const {studentId} = transaction;

    logger.info(`${studentId} ${description} 성공`);

    await this.leaveHistory(transaction, 0, type);
  }

  private async onFail(
    {transaction}: CommitDiscountTransactionParams,
    failedAt: number,
    type: string,
    description: string
  ) {
    const {studentId} = transaction;
    const transactionString = JSON.stringify(transaction);

    logger.warn(
      `${studentId} ${description} 실패: 규칙 ${failedAt} 검증 실패: ${transactionString}`
    );

    await this.leaveHistory(
      transaction,
      failedAt,
      type,
      `${description} 실패: 규칙 ${failedAt} 검증 실패`
    );
  }

  private async leaveHistory(
    transaction: DiscountTransaction,
    failedAt: number,
    type: string,
    message: string = ''
  ) {
    const {studentId, cafeteriaId, mealType} = transaction;

    const history = DiscountHistory.create({
      type: type,
      user: await User.findOneOrFail({studentId}),
      cafeteria: await Cafeteria.findOneOrFail(cafeteriaId),
      mealType: mealType,
      failedAt: failedAt,
      message: message,
      timestamp: new Date(),
    });

    await history.save();
  }
}

export default new CommitDiscountTransaction();
