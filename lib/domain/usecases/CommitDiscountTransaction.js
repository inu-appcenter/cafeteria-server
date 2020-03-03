/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020 INU Appcenter <potados99@gmail.com>
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
'use strict';

import UseCase from './UseCase';

class CommitDiscountTransaction extends UseCase {
  static SUCCESS = 0;
  static ALREADY_DISCOUNTED = 1;
  static INTERNAL_ERROR = 2;

  constructor({transactionRepository, transactionValidator}) {
    super();
    this.transactionRepository = transactionRepository;
    this.transactionValidator = transactionValidator;
  }

  async onExecute({transaction, confirm}) {
    if (confirm) {
      // Write it to DB.

      const firstToday = await this.transactionValidator.isFirstToday(transaction.userId);
      if (firstToday) {
        const writeResult = await this.transactionRepository.tryWriteDiscountTransaction(transaction);
        if (writeResult) {
          return CommitDiscountTransaction.SUCCESS;
        } else {
          return CommitDiscountTransaction.INTERNAL_ERROR;
        }
      } else {
        return CommitDiscountTransaction.ALREADY_DISCOUNTED;
      }
    } else {
      // Cancel transaction, remove it from DB.

      const removeResult = await this.transactionRepository.tryRemoveDiscountTransaction(transaction);
      if (removeResult) {
        return CommitDiscountTransaction.SUCCESS;
      } else {
        return CommitDiscountTransaction.INTERNAL_ERROR;
      }
    }
  }
}

export default CommitDiscountTransaction;
