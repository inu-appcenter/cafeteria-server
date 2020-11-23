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
      return await this._onValidationFailure(transaction, transactionToken, 'Wrong params', DiscountValidationResults.UNUSUAL_WRONG_PARAM);
    }

    const basicTestResult = await this._testBasicThings(transaction, 'Validate');
    if (basicTestResult !== DiscountValidationResults.USUAL_SUCCESS) {
      return await this._onValidationFailure(transaction, transactionToken, 'Basic test failed', basicTestResult);
    }

    await this._updateLastBarcodeTagTime(transaction);

    const tokenTestResult = await this._testTokenThing(transaction, transactionToken, 'Validate');
    if (tokenTestResult !== DiscountValidationResults.USUAL_SUCCESS) {
      return await this._onValidationFailure(transaction, transactionToken, 'Token test failed', tokenTestResult);
    }

    return await this._onValidationSuccess(transaction, transactionToken);
  }

  async commitDiscountTransaction({transaction, transactionToken, confirm}) {
    if (!transaction || !transactionToken) {
      return this._onCommitFailure(transaction, transactionToken, confirm, 'Transaction or transaction token is falsy');
    }

    const basicTestResult = await this._testBasicThings(transaction, 'Commit');
    if (basicTestResult !== DiscountValidationResults.USUAL_SUCCESS) {
      return this._onCommitFailure(transaction, transactionToken, confirm, 'Basic test failed');
    }

    const tokenTestResult = await this._testTokenThing(transaction, transactionToken, 'Commit');
    if (tokenTestResult !== DiscountValidationResults.USUAL_SUCCESS) {
      return this._onCommitFailure(transaction, transactionToken, confirm, 'Token test failed');
    }

    if (confirm === true) {
      return this._proceedCommittingTransaction(transaction, transactionToken, confirm);
    } else if (confirm === false) {
      return this._cancelTransaction(transaction, transactionToken, confirm);
    } else {
      // Neither Y nor N.
      return this._onCommitFailure(transaction, transactionToken, confirm, 'Neither Y nor N');
    }
  }

  async _testBasicThings(transaction, tag = '') {
    if (!await this.transactionValidator.requestShouldBeNotMalformed(transaction)) {
      return await this._onMalformedTransaction(transaction);
    }

    const {userId, cafeteriaId, mealType} = transaction;

    const tests = [
      {
        ruleId: 1,
        validate: () => this.transactionValidator.requestShouldBeInMealTime(cafeteriaId, mealType),
        failure: () => DiscountValidationResults.USUAL_FAIL,
      }, {
        ruleId: 2,
        validate: () => this.transactionValidator.cafeteriaShouldSupportDiscount(cafeteriaId),
        failure: () => DiscountValidationResults.UNUSUAL_WRONG_PARAM,
      }, {
        ruleId: 3,
        validate: () => this.transactionValidator.userShouldExist(userId),
        failure: () => DiscountValidationResults.UNUSUAL_NO_BARCODE,
      }, {
        ruleId: 4,
        validate: () => this.transactionValidator.barcodeShouldBeActive(userId, config.transaction.barcodeLifetimeMinutes),
        failure: () => DiscountValidationResults.USUAL_FAIL,
      }, {
        ruleId: 5,
        validate: () => this.transactionValidator.discountShouldBeFirstToday(userId),
        failure: () => DiscountValidationResults.USUAL_FAIL,
      }, {
        ruleId: 6,
        validate: () => this.transactionValidator.barcodeShouldNotBeUsedRecently(userId, config.transaction.barcodeTagMinimumIntervalSecs),
        failure: () => DiscountValidationResults.USUAL_FAIL,
      },
    ];

    return await this._test(transaction, tests, this._testResultHandlers(transaction, tag));
  }

  async _testTokenThing(transaction, transactionToken, tag = '') {
    if (!await this.transactionValidator.requestShouldBeNotMalformed(transaction)) {
      return await this._onMalformedTransaction(transaction);
    }

    const {cafeteriaId} = transaction;

    const tests = [
      {
        ruleId: 7,
        validate: () => this.transactionValidator.tokenShouldBeValid(cafeteriaId, transactionToken),
        failure: () => DiscountValidationResults.UNUSUAL_WRONG_PARAM,
      },
    ];

    return await this._test(transaction, tests, this._testResultHandlers(transaction, tag));
  }

  async _onMalformedTransaction(transaction) {
    logger.warn(`invalid transaction blocked: ${transaction}`);

    return DiscountValidationResults.UNUSUAL_WRONG_PARAM;
  }

  _testResultHandlers(transaction, tag) {
    const onFailAt = async (at) => {
      logger.warn(
        this._userName(transaction) +
        await this._ruleSummary(at) +
        '실패',
      );

      await this.transactionRepository.leaveTransactionHistory(
        new TransactionHistory({
          type: tag,
          transaction: transaction,
          failedAt: at,
          message: await this._ruleName(at),
        }),
      );
    };

    const onBypassAt = async (at) => {
      logger.info(
        this._userName(transaction) +
        await this._ruleSummary(at) +
        '우회',
      );
    };

    const onPassAt = async (at) => {
      logger.info(
        this._userName(transaction) +
        await this._ruleSummary(at) +
        '통과',
      );
    };

    return {
      onFailAt,
      onBypassAt,
      onPassAt,
    };
  }

  async _ruleSummary(ruleId) {
    const rule = await this.transactionRepository.getDiscountRule(ruleId);

    if (!rule) {
      return `[RULE ${ruleId}] `;
    }

    return `[RULE ${rule.id}: ${rule.name}(${rule.description}, ${rule.enabled ? '켜짐' : '꺼짐'})] `;
  }

  async _ruleName(ruleId) {
    const rule = await this.transactionRepository.getDiscountRule(ruleId);

    if (!rule) {
      return null;
    }

    return rule.name;
  }

  async _test(transaction, validations, {onFailAt, onBypassAt, onPassAt}) {
    for (const validation of validations) {
      const passed = await validation.validate();

      if (passed) {
        await onPassAt(validation.ruleId);
      } else {
        if (await this._canBypassRule(validation.ruleId)) {
          await onBypassAt(validation.ruleId);
        } else {
          await onFailAt(validation.ruleId);
          return validation.failure();
        }
      }
    }

    return DiscountValidationResults.USUAL_SUCCESS;
  }

  async _canBypassRule(ruleId) {
    const ruleEnabled = await this._isRuleEnabled(ruleId);

    return !ruleEnabled; // We can bypass it only when it is disabled.
  }

  async _isRuleEnabled(ruleId) {
    const rule = await this.transactionRepository.getDiscountRule(ruleId);

    if (!rule) {
      return true; // Consider it enabled if don't know.
    }

    return rule.enabled;
  }

  _updateLastBarcodeTagTime(transaction) {
    const {userId} = transaction;

    this.transactionRepository.updateBarcodeTagTime(userId);
  }

  async _proceedCommittingTransaction(transaction, transactionToken, confirm) {
    const writeResult = await this.transactionRepository.writeDiscountTransaction(transaction);

    if (writeResult) {
      return await this._onCommitSuccess(transaction, transactionToken, confirm);
    } else {
      return await this._onCommitFailure(transaction, transactionToken, confirm, 'DB 실패');
    }
  }

  async _cancelTransaction(transaction, transactionToken, confirm) {
    const removeResult = await this.transactionRepository.removeDiscountTransaction(transaction);

    if (removeResult) {
      return await this._onCommitSuccess(transaction, transactionToken, confirm);
    } else {
      return await this._onCommitFailure(transaction, transactionToken, confirm, 'DB 실패');
    }
  }

  async _onValidationFailure(transaction, transactionToken, message, returnValue) {
    logger.warn(
      this._userName(transaction) +
      `유효성 검증 실패: ${message}: ` +
      this._format(transaction, transactionToken),
    );

    // Leaving failure history will be done in each tests.

    return returnValue;
  }

  async _onValidationSuccess(transaction, transactionToken) {
    logger.info(
      this._userName(transaction) +
      `유효성 검증 성공: ` +
      this._format(transaction, transactionToken),
    );

    await this._leaveHistory(transaction, 'Validate');

    return DiscountValidationResults.USUAL_SUCCESS;
  }

  async _onCommitFailure(transaction, transactionToken, confirm, message) {
    logger.warn(
      this._userName(transaction) +
      `트랜잭션 커밋 실패: ${message}: ` +
      this._format(transaction, transactionToken, confirm),
    );

    await this._leaveFailure(transaction, -1, message, confirm ? 'Commit' : 'Cancel');

    return DiscountCommitResults.FAIL;
  }

  async _onCommitSuccess(transaction, transactionToken, confirm) {
    logger.info(
      this._userName(transaction) +
      `트랜잭션 커밋 ${confirm ? '등록' : '취소'} 성공: ` +
      this._format(transaction, transactionToken, confirm),
    );

    await this._leaveHistory(transaction, confirm ? 'Commit' : 'Cancel');

    return DiscountCommitResults.SUCCESS;
  }

  async _leaveHistory(transaction, tag) {
    await this.transactionRepository.leaveTransactionHistory(
      new TransactionHistory({
        type: tag,
        transaction: transaction,
        failedAt: 0,
        message: '',
      }),
    );
  }

  async _leaveFailure(transaction, failedAt, message, tag) {
    await this.transactionRepository.leaveTransactionHistory(
      new TransactionHistory({
        type: tag,
        transaction: transaction,
        failedAt: failedAt,
        message: message,
      }),
    );
  }

  _userName(transaction) {
    const userId = transaction ? (transaction.userId ? transaction.userId : 'UNKNOWN') : 'UNKNOWN';

    return `학번 '${userId}' `;
  }

  _format(...params) {
    return `(${params.map((param) => JSON.stringify(param)).join(', ')})' `;
  }
}

export default TransactionService;
