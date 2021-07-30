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

import {DiscountTransaction} from '@inu-cafeteria/backend-core';
import DiscountRulesChecker from './rules/DiscountRulesChecker';
import config from '../../../../config';
import RuleViolation from './tests/RuleViolation';
import TestRunner from './tests/TestRunner';
import {Test} from './tests/Test';
import {
  BarcodeNotActivated,
  BarcodeUsedRecently,
  DiscountAlreadyMadeHereToday,
  DiscountNotSupportedHere,
  DiscountNotAvailableNow,
  RequestMalformed,
  UserNotIdentified,
} from '../common/Errors';

export type ValidationParams = {
  transaction: DiscountTransaction;
};

export type ValidationResult = {
  error: Error | null;
  failedAt: number;
};

export default class DiscountTransactionValidator {
  constructor(private readonly params: ValidationParams) {}

  async validateForVerify() {
    return await this.validate(async () => {
      await this.testRequestFormat();
      await this.testBasicRules();
    });
  }

  async validateForConfirm() {
    return await this.validate(async () => {
      await this.testRequestFormat();
      await this.testBasicRules([6 /** ignore rule 6: barcodeShouldNotBeUsedRecently */]);
    });
  }

  async validateForCancel() {
    return await this.validate(async () => {
      await this.testRequestFormat();
      await this.testBasicRules([
        5 /** ignore rule 5: discountAtThisCafeteriaShouldBeFirstToday (should rather exist) */,
        6 /** ignore rule 6: barcodeShouldNotBeUsedRecently */,
      ]);
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
      error: null,
      failedAt: 0,
    };
  }

  private async testRequestFormat() {
    const malformed = !DiscountRulesChecker.requestShouldBeNotMalformed(this.params.transaction);
    if (malformed) {
      throw new RuleViolation({error: RequestMalformed(), failedAt: -1});
    }
  }

  private async testBasicRules(excludedRuleIds: number[] = []) {
    const {transaction} = this.params;
    const {studentId, cafeteriaId, mealType} = transaction;
    const {barcodeLifetimeMinutes, barcodeTagMinimumIntervalSecs} = config.transaction.validation;

    const tests: Test[] = [
      {
        ruleId: 1,
        validate: () => DiscountRulesChecker.cafeteriaShouldSupportDiscount(cafeteriaId),
        failure: DiscountNotSupportedHere(),
      },
      {
        ruleId: 2,
        validate: () => DiscountRulesChecker.requestShouldBeInMealTime(cafeteriaId, mealType),
        failure: DiscountNotAvailableNow(),
      },
      {
        ruleId: 3,
        validate: () => DiscountRulesChecker.userShouldExist(studentId),
        failure: UserNotIdentified(),
      },
      {
        ruleId: 4,
        validate: () =>
          DiscountRulesChecker.barcodeShouldBeActive(studentId, barcodeLifetimeMinutes),
        failure: BarcodeNotActivated(),
      },
      {
        ruleId: 5,
        validate: () =>
          DiscountRulesChecker.barcodeShouldNotBeUsedRecently(
            studentId,
            barcodeTagMinimumIntervalSecs
          ),
        failure: BarcodeUsedRecently(),
      },
      {
        ruleId: 6,
        validate: () =>
          DiscountRulesChecker.discountAtThisCafeteriaShouldBeFirstToday(studentId, cafeteriaId),
        failure: DiscountAlreadyMadeHereToday(),
      },
    ];

    await new TestRunner(tests, {studentId, excludedRuleIds}).runTests();
  }
}
