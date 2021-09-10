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

import DiscountTransactionValidator from '../validation/DiscountTransactionValidator';
import DiscountTransactionHandler from './base/DiscountTransactionHandler';
import {User, ValidationResult} from '@inu-cafeteria/backend-core';

export default class VerifyHandler extends DiscountTransactionHandler {
  taskType = 'Verify' as const;
  taskName = '할인 트랜잭션 검증';

  protected async afterValidation(): Promise<void> {
    /**
     * 이 핸들러(VerifyHandler)는 바코드 태그 직후에 실행됩니다.
     * 검증이 끝나면 성공 유무 관계없이 바코드 태그 시간을 업데이트합니다.
     */
    await this.updateBarcodeTagTime();
  }

  protected async updateBarcodeTagTime() {
    const {studentId} = this.transaction;

    await User.update({studentId}, {barcodeTaggedAt: new Date()});
  }

  async validate(validator: DiscountTransactionValidator): Promise<ValidationResult> {
    return await validator.validateForVerify();
  }
}
