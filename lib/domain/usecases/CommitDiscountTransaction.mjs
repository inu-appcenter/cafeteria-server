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

import UseCase from './UseCase';
import DiscountCommitResults from '../constants/DiscountCommitResults';
import logger from '../../common/utils/logger';

/**
 * Commit a discount transaction.
 * It could be fixed or canceled.
 */
class CommitDiscountTransaction extends UseCase {
  constructor({transactionRepository, transactionValidator}) {
    super();

    this.transactionRepository = transactionRepository;
    this.transactionValidator = transactionValidator;
  }

  async onExecute({transaction, confirm}) {
    const isGood = await this.transactionValidator.isNotMalformed(transaction);
    if (!isGood) {
      logger.warn(`invalid transaction blocked: ${transaction}`);
      return DiscountCommitResults.FAIL;
    }

    if (confirm === true) {
      // Write it to DB.

      const firstToday = await this.transactionValidator.isFirstToday(transaction.userId);
      if (firstToday) {
        // First today.
        logger.info(`${transaction.userId} committing: is first today :)`);

        const writeResult = await this.transactionRepository.tryWriteDiscountTransaction(transaction);

        if (writeResult) {
          logger.info(`${transaction.userId} committing: SUCCEEDED`);

          return DiscountCommitResults.SUCCESS;
        } else {
          logger.info(`${transaction.userId} committing: FAILED`);

          return DiscountCommitResults.FAIL;
        }
      } else {
        // Not first today.
        logger.info(`${transaction.userId} committing: is not first today :(`);

        return DiscountCommitResults.ALREADY_DISCOUNTED;
      }
    } else if (confirm === false) {
      // Cancel transaction, remove it from DB.

      logger.info(`${transaction.userId} canceling :|`);

      const removeResult = await this.transactionRepository.tryRemoveDiscountTransaction(transaction);

      if (removeResult) {
        logger.info(`${transaction.userId} canceling: SUCCEEDED`);

        return DiscountCommitResults.SUCCESS;
      } else {
        logger.info(`${transaction.userId} canceling: FAILED`);

        return DiscountCommitResults.FAIL;
      }
    } else {
      // WTF?
      logger.warn(`${transaction.userId} WTF: wrong confirm param: ${confirm}`);
      return DiscountCommitResults.FAIL;
    }
  }
}

export default CommitDiscountTransaction;
