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

import UseCase from '../../common/base/UseCase';
import logger from '../../common/logging/logger';
import CancelHandler from './handler/CancelHandler';
import {DiscountTransactionParams} from './base/Types';

class CancelDiscountTransaction extends UseCase<DiscountTransactionParams, void> {
  async onExecute({transaction, transactionToken}: DiscountTransactionParams): Promise<void> {
    logger.info(`할인 트랜잭션 Cancel을 처리합니다.`);

    await new CancelHandler({
      transaction,
      transactionToken,
      taskType: 'Cancel',
      taskName: '할인 트랜잭션 취소',
    }).handle();
  }
}

export default new CancelDiscountTransaction();