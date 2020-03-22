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

import logger from '../../common/utils/logger';
import DiscountValidationResults from '../constants/DiscountValidationResults';
import DiscountCommitResults from '../constants/DiscountCommitResults';

import config from '../../../config';

class TransactionService {
  constructor({transactionRepository, transactionValidator}) {
    this.transactionRepository = transactionRepository;
    this.transactionValidator = transactionValidator;
  }

  async validateDiscountTransaction({transaction, transactionToken}) {
    if (!transaction || !transactionToken) {
      return DiscountValidationResults.UNUSUAL_WRONG_PARAM;
    }

    const basicValidationResult = await this._validateBasicThings(transaction);
    if (basicValidationResult !== DiscountValidationResults.USUAL_SUCCESS) {
      return basicValidationResult;
    }

    // Give user a mercy.
    await this._updateLastBarcodeTagTime(transaction);

    const tokenValidationResult = await this._validateTokenThing(transaction, transactionToken);
    if (tokenValidationResult !== DiscountValidationResults.USUAL_SUCCESS) {
      return tokenValidationResult;
    }

    return DiscountValidationResults.USUAL_SUCCESS;
  }

  async _validateBasicThings(transaction) {
    const {userId, cafeteriaId, mealType} = transaction;

    const isGood = await this.transactionValidator.isNotMalformed(transaction);
    if (!isGood) {
      logger.warn(`invalid transaction blocked: ${transaction}`);
      return DiscountValidationResults.UNUSUAL_WRONG_PARAM;
    }

    const isInMealTime = await this.transactionValidator.isInMealTime(cafeteriaId, mealType);
    if (!isInMealTime) {
      logger.info(`${userId} validating: is not in meal time :(`);

      return DiscountValidationResults.USUAL_FAIL;
    }

    logger.info(`${userId} validating: is in meal time :)`);

    const cafeteriaSupportsDiscount = await this.transactionValidator.cafeteriaSupportsDiscount(cafeteriaId);
    if (!cafeteriaSupportsDiscount) {
      logger.warn(`${userId} validating: this cafeteria(${cafeteriaId}) does not support discount :(`);

      return DiscountValidationResults.UNUSUAL_WRONG_PARAM;
    }

    logger.info(`${userId} validating: cafeteria supports discount :)`);

    const userExists = await this.transactionValidator.userExists(userId);
    if (!userExists) {
      logger.warn(`${userId} validating: user does not exist :(`);

      return DiscountValidationResults.UNUSUAL_NO_BARCODE; /* no barcode = no user */
    }

    logger.info(`${userId} validating: user exists :)`);

    const barcodeIsActive = await this.transactionValidator.isBarcodeActive(userId, config.transaction.barcodeLifetimeMinutes);
    if (!barcodeIsActive) {
      logger.info(`${userId} validating: barcode is not active :(`);

      return DiscountValidationResults.USUAL_FAIL;
    }

    logger.info(`${userId} validating: barcode is active :)`);

    const isFirstToday = await this.transactionValidator.isFirstToday(userId);
    if (!isFirstToday) {
      logger.info(`${userId} validating: is not first today :(`);

      return DiscountValidationResults.USUAL_FAIL;
    }

    logger.info(`${userId} validating: is first today :)`);

    const isNotFrequent = await this.transactionValidator.barcodeNotUsedRecently(userId, config.transaction.barcodeTagMinimumIntervalSecs);
    if (!isNotFrequent) {
      logger.info(`${userId} validating: is too frequent :(`);

      return DiscountValidationResults.USUAL_FAIL;
    }

    logger.info(`${userId} validating: is not frequent :)`);

    return DiscountValidationResults.USUAL_SUCCESS;
  }

  _updateLastBarcodeTagTime(transaction) {
    const {userId} = transaction;

    this.transactionRepository.updateBarcodeTagTime(userId);
  }

  async _validateTokenThing(transaction, transactionToken) {
    const {userId, cafeteriaId} = transaction;

    const tokenIsValid = await this.transactionValidator.isTokenValid(cafeteriaId, transactionToken);
    if (!tokenIsValid) {
      logger.warn(`${userId} validating: cafeteria token is invalid :(`);

      return DiscountValidationResults.UNUSUAL_WRONG_PARAM;
    }

    logger.info(`${userId} validating: cafeteria token is valid :)`);

    logger.info(`${userId} validating: SUCCEEDED`);

    return DiscountValidationResults.USUAL_SUCCESS;
  }

  async commitDiscountTransaction({transaction, confirm}) {
    const basicValidationResult = await this._validateBasicThings(transaction);
    if (basicValidationResult !== DiscountValidationResults.USUAL_SUCCESS) {
      return this._onCommitFailure(transaction, confirm);
    }

    if (confirm === true) {
      return this._proceedCommittingTransaction(transaction);
    } else if (confirm === false) {
      return this._cancelTransaction(transaction);
    } else {
      return this._onCommitFailure(transaction, confirm);
    }
  }

  async _proceedCommittingTransaction(transaction) {
    const {userId} = transaction;

    const writeResult = await this.transactionRepository.writeDiscountTransaction(transaction);
    if (writeResult) {
      logger.info(`${userId} committing: SUCCEEDED`);

      return DiscountCommitResults.SUCCESS;
    } else {
      logger.info(`${userId} committing: FAILED`);

      return DiscountCommitResults.FAIL;
    }
  }

  async _cancelTransaction(transaction) {
    const {userId} = transaction;

    logger.info(`${userId} canceling :|`);

    const removeResult = await this.transactionRepository.removeDiscountTransaction(transaction);
    if (removeResult) {
      logger.info(`${userId} canceling: SUCCEEDED`);

      return DiscountCommitResults.SUCCESS;
    } else {
      logger.info(`${userId} canceling: FAILED`);

      return DiscountCommitResults.FAIL;
    }
  }

  _onCommitFailure(transaction, confirm) {
    const {userId} = transaction;

    logger.warn(`${userId} commit failure: confirm: ${confirm}, transaction: ${transaction}`);

    return DiscountCommitResults.FAIL;
  }
}

export default TransactionService;
