import DiscountTransactionValidator from './validation/DiscountTransactionValidator';
import {ValidationResult, ValidationResultCode} from './validation/ValidationResult';
import logger from '../../common/logging/logger';
import {Cafeteria, DiscountHistory, DiscountTransaction, User} from '@inu-cafeteria/backend-core';
import {CommitDiscountTransactionParams} from './CommitDiscountTransaction';

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

export default class CommitHandler {
  constructor(private readonly params: CommitDiscountTransactionParams) {}

  async handle(): Promise<void> {
    const {transaction, transactionToken, confirm} = this.params;
    const validator = new DiscountTransactionValidator(transaction, transactionToken);

    if (confirm) {
      await this.doFor(() => validator.validateForCommit(), 'Commit', '할인 트랜잭션 확정');
    } else {
      await this.doFor(() => validator.validateForCancel(), 'Cancel', '할인 트랜잭션 취소');
    }
  }

  private async doFor(
    validate: () => Promise<ValidationResult>,
    type: 'Commit' | 'Cancel',
    description: string
  ) {
    const {code, failedAt} = await validate();

    if (code === ValidationResultCode.USUAL_SUCCESS) {
      await this.onSuccess(type, description);
    } else {
      await this.onFail(failedAt, type, description);
    }
  }

  private async onSuccess(type: string, description: string) {
    const {transaction} = this.params;
    const {studentId} = transaction;

    logger.info(`${studentId} ${description} 성공`);

    await this.leaveHistory(0, type);
  }

  private async onFail(failedAt: number, type: string, description: string) {
    const {transaction} = this.params;
    const {studentId} = transaction;
    const transactionString = JSON.stringify(transaction);

    logger.warn(
      `${studentId} ${description} 실패: 규칙 ${failedAt} 검증 실패: ${transactionString}`
    );

    await this.leaveHistory(failedAt, type, `${description} 실패: 규칙 ${failedAt} 검증 실패`);
  }

  private async leaveHistory(failedAt: number, type: string, message: string = '') {
    const {transaction} = this.params;
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
