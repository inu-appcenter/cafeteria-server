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

import {DiscountTransaction} from '@inu-cafeteria/backend-core';
import DiscountRulesChecker from './rules/DiscountRulesChecker';
import config from '../../../../config';
import RuleViolation from './errors/RuleViolation';
import TestRunner from './tests/TestRunner';
import {ValidationResult, ValidationResultCode} from './ValidationResult';
import {Test} from './tests/Test';

export default class DiscountTransactionValidator {
  constructor(
    private readonly transaction: DiscountTransaction,
    private readonly transactionToken: string
  ) {}

  async validateForBarcodeChecking() {
    return await this.validate(async () => {
      await this.testRequestFormat();
      await this.testBasicRules();
      await this.testTokenRule();
    });
  }

  async validateForCommit() {
    return await this.validate(async () => {
      await this.testRequestFormat();
      await this.testBasicRules([6 /** ignore rule 6: barcodeShouldNotBeUsedRecently */]);
      await this.testTokenRule();
    });
  }

  async validateForCancel() {
    return await this.validate(async () => {
      await this.testRequestFormat();
      await this.testBasicRules([
        5 /** ignore rule 5: discountAtThisCafeteriaShouldBeFirstToday (should rather exist) */,
        6 /** ignore rule 6: barcodeShouldNotBeUsedRecently */,
      ]);
      await this.testTokenRule();
    });
  }

  private async validate(body: () => Promise<void>): Promise<ValidationResult> {
    try {
      await body();
    } catch (e) {
      if (e instanceof RuleViolation) {
        return e.result;
      } else {
        throw e;
      }
    }

    return {
      code: ValidationResultCode.USUAL_SUCCESS,
      failedAt: 0,
    };
  }

  private async testRequestFormat() {
    const malformed = !DiscountRulesChecker.requestShouldBeNotMalformed(this.transaction);
    if (malformed) {
      throw new RuleViolation({code: ValidationResultCode.UNUSUAL_WRONG_PARAM, failedAt: -1});
    }
  }

  private async testBasicRules(excludedRuleIds: number[] = []) {
    const {transaction} = this;
    const {studentId, cafeteriaId, mealType} = transaction;
    const {barcodeLifetimeMinutes, barcodeTagMinimumIntervalSecs} = config.transaction.validation;

    const tests: Test[] = [
      {
        ruleId: 1,
        validate: () => DiscountRulesChecker.requestShouldBeInMealTime(cafeteriaId, mealType),
        failureCode: ValidationResultCode.USUAL_FAIL,
      },
      {
        ruleId: 2,
        validate: () => DiscountRulesChecker.cafeteriaShouldSupportDiscount(cafeteriaId),
        failureCode: ValidationResultCode.UNUSUAL_WRONG_PARAM,
      },
      {
        ruleId: 3,
        validate: () => DiscountRulesChecker.userShouldExist(studentId),
        failureCode: ValidationResultCode.UNUSUAL_NO_BARCODE,
      },
      {
        ruleId: 4,
        validate: () =>
          DiscountRulesChecker.barcodeShouldBeActive(studentId, barcodeLifetimeMinutes),
        failureCode: ValidationResultCode.USUAL_FAIL,
      },
      {
        ruleId: 5,
        validate: () =>
          DiscountRulesChecker.discountAtThisCafeteriaShouldBeFirstToday(studentId, cafeteriaId),
        failureCode: ValidationResultCode.USUAL_FAIL,
      },
      {
        ruleId: 6,
        validate: () =>
          DiscountRulesChecker.barcodeShouldNotBeUsedRecently(
            studentId,
            barcodeTagMinimumIntervalSecs
          ),
        failureCode: ValidationResultCode.USUAL_FAIL,
      },
    ];

    await new TestRunner(tests, {studentId, excludedRuleIds}).runTests();
  }

  private async testTokenRule() {
    const {transaction, transactionToken} = this;
    const {studentId, cafeteriaId} = transaction;

    const tests: Test[] = [
      {
        ruleId: 7,
        validate: () => DiscountRulesChecker.tokenShouldBeValid(cafeteriaId, transactionToken),
        failureCode: ValidationResultCode.UNUSUAL_WRONG_PARAM,
      },
    ];

    await new TestRunner(tests, {studentId, excludedRuleIds: []}).runTests();
  }
}
