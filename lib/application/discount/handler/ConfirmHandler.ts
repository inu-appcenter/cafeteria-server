/**
 * This file is part of INU Cafeteria.
 *
 * Copyright 2021 INU Global App Center <potados99@gmail.com>
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

import DiscountTransactionValidator from '../validation/DiscountTransactionValidator';
import DiscountTransactionHandler from './base/DiscountTransactionHandler';
import {logger} from '@inu-cafeteria/backend-core';
import {ValidationResult} from '@inu-cafeteria/backend-core';

export default class ConfirmHandler extends DiscountTransactionHandler {
  taskType = 'Confirm' as const;
  taskName = '할인 트랜잭션 확정';

  async validate(validator: DiscountTransactionValidator): Promise<ValidationResult> {
    return await validator.validateForConfirm();
  }

  protected async afterValidationSuccess(): Promise<void> {
    const {transaction} = this;
    const {studentId} = transaction;

    /**
     * 확정된 할인 기록 저장은 여기에서 일어납니다!
     */
    await transaction.save();

    logger.info(`${studentId}의 할인 확정이 저장되었습니다.`);
  }
}
