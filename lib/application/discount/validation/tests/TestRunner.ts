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

import logger from '../../../../common/logging/logger';
import {CafeteriaDiscountRule} from '@inu-cafeteria/backend-core';
import RuleViolation from './RuleViolation';
import {Test, TestContext} from './Test';

export default class TestRunner {
  constructor(private readonly tests: Test[], private readonly context: TestContext) {}

  async runTests() {
    const {tests, context} = this;
    const {studentId, excludedRuleIds} = context;

    logger.info(`${studentId} Rule ${tests.map((test) => test.ruleId).join(', ')} 적용중`);

    for (const test of tests) {
      if (excludedRuleIds.includes(test.ruleId)) {
        continue;
      }

      const passed = await test.validate();
      const canBypass = await CafeteriaDiscountRule.canBypassRule(test.ruleId);
      const ruleSummary = await CafeteriaDiscountRule.getSummary(test.ruleId);

      if (passed) {
        logger.info(`${studentId} 통과 ${ruleSummary}`);
      } else {
        if (canBypass) {
          logger.info(`${studentId} 우회 ${ruleSummary}`);
        } else {
          logger.warn(`${studentId} 실패 ${ruleSummary}`);
          throw new RuleViolation({error: test.failure, failedAt: test.ruleId});
        }
      }
    }
  }
}
