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
import TransactionHistory from '../entities/TransactionHistory';

class TransactionService {
  constructor({transactionRepository, transactionValidator}) {
    this.transactionRepository = transactionRepository;
    this.transactionValidator = transactionValidator;
  }

  async validateDiscountTransaction({transaction, transactionToken}) {
    if (!transaction || !transactionToken) {
      logger.warn(`transaction or transactionToken missing!`);
      return DiscountValidationResults.UNUSUAL_WRONG_PARAM;
    }

    const failHandler = this._eachValidationFailHandler('Validation', transaction);

    const basicValidationResult = await this._validateBasicThings(transaction, failHandler);
    if (basicValidationResult !== DiscountValidationResults.USUAL_SUCCESS) {
      return basicValidationResult;
    }

    /**
     * Give user a mercy.
     * Failing at  _validateBasicThings does not update last barcode tag time,
     * allowing user to retry tagging for long long 15 secs.
     */
    await this._updateLastBarcodeTagTime(transaction);

    const tokenValidationResult = await this._validateTokenThing(transaction, transactionToken, failHandler);
    if (tokenValidationResult !== DiscountValidationResults.USUAL_SUCCESS) {
      return tokenValidationResult;
    }

    return DiscountValidationResults.USUAL_SUCCESS;
  }

  async canBypassRule(ruleId) {
    const ruleEnabled = await this._isRuleEnabled(ruleId);

    return !ruleEnabled; // We can bypass it only when it is disabled.
  }

  async _isRuleEnabled(ruleId) {
    const ruleStatus = await this.transactionRepository.getDiscountRule(ruleId);

    if (!ruleStatus) {
      return true; // Consider it enabled if don't know.
    }

    return ruleStatus.enabled;
  }

  async _validateBasicThings(transaction, onFailAt) {
    const {userId, cafeteriaId, mealType} = transaction;

    const isGood = await this.transactionValidator.requestShouldBeNotMalformed(transaction);
    if (!isGood) {
      logger.warn(`invalid transaction blocked: ${transaction}`);
      return DiscountValidationResults.UNUSUAL_WRONG_PARAM;
    }

    // RULE NUMBER 1
    const isInMealTime = await this.transactionValidator.requestShouldBeInMealTime(cafeteriaId, mealType);
    if (!isInMealTime) {
      if (await this.canBypassRule(1)) {
        logger.info(`${userId} [BYPASSING RULE 1]: tried to get discount with unsupported meal type ${mealType}, but bypassed.`);
      } else {
        logger.warn(`${userId} validating: [RULE 1 requestShouldBeInMealTime] failed :(`);
        await onFailAt(1);
        return DiscountValidationResults.USUAL_FAIL;
      }
    }

    logger.info(`${userId} validating: [RULE 1 requestShouldBeInMealTime] passed :)`);

    // RULE NUMBER 2
    const cafeteriaSupportsDiscount = await this.transactionValidator.cafeteriaShouldSupportDiscount(cafeteriaId);
    if (!cafeteriaSupportsDiscount) {
      if (await this.canBypassRule(2)) {
        logger.info(`${userId} [BYPASSING RULE 2]: tried to get discount at cafeteria ${cafeteriaId}, which does not support discount, but bypassed.`);
      } else {
        logger.warn(`${userId} validating: [RULE 2 cafeteriaShouldSupportDiscount] failed :(`);
        await onFailAt(2);
        return DiscountValidationResults.UNUSUAL_WRONG_PARAM;
      }
    }

    logger.info(`${userId} validating: [RULE 2 cafeteriaShouldSupportDiscount] passed :)`);

    // RULE NUMBER 3
    const userExists = await this.transactionValidator.userShouldExist(userId);
    if (!userExists) {
      if (await this.canBypassRule(3)) {
        logger.info(`${userId} [BYPASSING RULE 3]: does not exist, but bypassed.`);
      } else {
        logger.warn(`${userId} validating: [RULE 3 userShouldExist] failed :(`);
        await onFailAt(3);
        return DiscountValidationResults.UNUSUAL_NO_BARCODE; /* no barcode = no user */
      }
    }

    logger.info(`${userId} validating: [RULE 3 userShouldExist] passed :)`);

    // RULE NUMBER 4
    const barcodeIsActive = await this.transactionValidator.barcodeShouldBeActive(userId, config.transaction.barcodeLifetimeMinutes);
    if (!barcodeIsActive) {
      if (await this.canBypassRule(4)) {
        logger.info(`${userId} [BYPASSING RULE 4]: did not activate his/her own barcode, but bypassed.`);
      } else {
        logger.warn(`${userId} validating: [RULE 4 barcodeShouldBeActive] failed :(`);
        await onFailAt(4);
        return DiscountValidationResults.USUAL_FAIL;
      }
    }

    logger.info(`${userId} validating: [RULE 4 barcodeShouldBeActive] passed :)`);

    // RULE NUMBER 5
    const isFirstToday = await this.transactionValidator.discountShouldBeFirstToday(userId);
    if (!isFirstToday) {
      if (await this.canBypassRule(5)) {
        logger.info(`${userId} [BYPASSING RULE 5]: has already got discount today, but bypassed.`);
      } else {
        logger.warn(`${userId} validating: [RULE 5 discountShouldBeFirstToday] failed :(`);
        await onFailAt(5);
        return DiscountValidationResults.USUAL_FAIL;
      }
    }

    logger.info(`${userId} validating: [RULE 5 discountShouldBeFirstToday] passed :)`);

    // RULE NUMBER 6
    const isNotFrequent = await this.transactionValidator.barcodeShouldNotBeUsedRecently(userId, config.transaction.barcodeTagMinimumIntervalSecs);
    if (!isNotFrequent) {
      if (await this.canBypassRule(6)) {
        logger.info(`${userId} [BYPASSING RULE 6]: is tagging barcode too frequently, but bypassed.`);
      } else {
        logger.warn(`${userId} validating: [RULE 6 barcodeShouldNotBeUsedRecently] failed :(`);
        await onFailAt(6);
        return DiscountValidationResults.USUAL_FAIL;
      }
    }

    logger.info(`${userId} validating: [RULE 6 barcodeShouldNotBeUsedRecently] passed :)`);

    return DiscountValidationResults.USUAL_SUCCESS;
  }

  _updateLastBarcodeTagTime(transaction) {
    const {userId} = transaction;

    this.transactionRepository.updateBarcodeTagTime(userId);
  }

  async _validateTokenThing(transaction, transactionToken, onFailAt) {
    const {userId, cafeteriaId} = transaction;

    // RULE NUMBER 7
    const tokenIsValid = await this.transactionValidator.tokenShouldBeValid(cafeteriaId, transactionToken);
    if (!tokenIsValid) {
      if (await this.canBypassRule(7)) {
        logger.info(`${userId} [BYPASSING RULE 7]: came with wrong cafeteria token, but bypassed.`);
      } else {
        logger.warn(`${userId} validating: [RULE 7 tokenShouldBeValid] failed :(`);
        await onFailAt(7);
        return DiscountValidationResults.UNUSUAL_WRONG_PARAM;
      }
    }

    logger.info(`${userId} validating: [RULE 7 tokenShouldBeValid] passed :)`);

    logger.info(`${userId} validating: [ALL RULES PASSED]`);

    return DiscountValidationResults.USUAL_SUCCESS;
  }

  async commitDiscountTransaction({transaction, transactionToken, confirm}) {
    if (!transaction || !transactionToken) {
      return this._onCommitFailure(transaction, transactionToken, confirm);
    }

    const failHandler = this._eachValidationFailHandler('Commit', transaction);

    const basicValidationResult = await this._validateBasicThings(transaction, failHandler);
    if (basicValidationResult !== DiscountValidationResults.USUAL_SUCCESS) {
      return this._onCommitFailure(transaction, transactionToken, confirm);
    }

    const tokenValidationResult = await this._validateTokenThing(transaction, transactionToken, failHandler);
    if (tokenValidationResult !== DiscountValidationResults.USUAL_SUCCESS) {
      return this._onCommitFailure(transaction, transactionToken, confirm);
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

  _onCommitFailure(transaction, token, confirm) {
    const {userId} = transaction;

    logger.warn(`${userId} commit failure: confirm: ${confirm}, transactionToken: ${token}, transaction: ${transaction}`);

    return DiscountCommitResults.FAIL;
  }

  _eachValidationFailHandler(type, transaction) {
    return async (failedAt) => {
      await this.transactionRepository.leaveTransactionHistory(
        new TransactionHistory({
          type,
          transaction,
          failedAt,
        }),
      );
    };
  }
}

export default TransactionService;
