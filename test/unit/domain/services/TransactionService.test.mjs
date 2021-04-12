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

import resolve, {initWithOverrides} from '../../../../lib/common/di/resolve';
import TransactionService from '../../../../lib/domain/services/TransactionService';
import DiscountValidationResults from '../../../../lib/domain/constants/DiscountValidationResults';
import DiscountTransaction from '../../../../lib/domain/entities/DiscountTransaction';
import DiscountCommitResults from '../../../../lib/domain/constants/DiscountCommitResults';
import modules from '../../../../lib/common/di/modules';
import DiscountTransactionValidatorMock from '../../../mocks/DiscountTransactionValidatorMock';
import DiscountTransactionValidator from '../../../../lib/domain/validators/DiscountTransactionValidator';
import TransactionRepositoryMock from '../../../mocks/TransactionRepositoryMock';
import TransactionRepository from '../../../../lib/domain/repositories/TransactionRepository';

beforeEach(async () => {
  await initWithOverrides(modules, [
    {
      create: async (r) => new TransactionRepositoryMock(),
      as: TransactionRepository,
    },
    {
      create: async (r) => new DiscountTransactionValidatorMock(),
      as: DiscountTransactionValidator,
    },
  ], true);
});

describe('# validateDiscountTransaction', () => {
  const validationTest = async function(failAt, expectation, bypass=0) {
    const service = getMockedService(failAt, bypass);
    const result = await service.validateDiscountTransaction({transaction: getExampleTransaction(), transactionToken: 'abcd'});

    expect(result).toBe(expectation);
  };

  it('should throw on undefined param', async () => {
    const service = resolve(TransactionService);

    // Sending null to the argument destructor will cause an exception.
    // noinspection JSCheckFunctionSignatures
    await expect(service.validateDiscountTransaction(null)).rejects.toThrow();
  });

  it('should catch null transaction in param', async () => {
    const service = resolve(TransactionService);
    const result = await service.validateDiscountTransaction({transaction: null, transactionToken: 'abc'});

    expect(result).toBe(DiscountValidationResults.UNUSUAL_WRONG_PARAM);
  });

  it('should catch null transactionToken in param', async () => {
    const service = resolve(TransactionService);
    const result = await service.validateDiscountTransaction({transaction: {}, transactionToken: null});

    expect(result).toBe(DiscountValidationResults.UNUSUAL_WRONG_PARAM);
  });

  it('should fail basic validation', async () => {
    await validationTest('requestShouldBeNotMalformed', DiscountValidationResults.UNUSUAL_WRONG_PARAM);
    await validationTest('requestShouldBeInMealTime', DiscountValidationResults.USUAL_FAIL);
    await validationTest('cafeteriaShouldSupportDiscount', DiscountValidationResults.UNUSUAL_WRONG_PARAM);
    await validationTest('userShouldExist', DiscountValidationResults.UNUSUAL_NO_BARCODE);
    await validationTest('barcodeShouldBeActive', DiscountValidationResults.USUAL_FAIL);
    await validationTest('discountAtThisCafeteriaShouldBeFirstToday', DiscountValidationResults.USUAL_FAIL);
    await validationTest('barcodeShouldNotBeUsedRecently', DiscountValidationResults.USUAL_FAIL);
    await validationTest('tokenShouldBeValid', DiscountValidationResults.UNUSUAL_WRONG_PARAM);
  });

  it('should succeed with bypass', async () => {
    await validationTest('requestShouldBeInMealTime', DiscountValidationResults.USUAL_SUCCESS, 1);
    await validationTest('cafeteriaShouldSupportDiscount', DiscountValidationResults.USUAL_SUCCESS, 2);
    await validationTest('userShouldExist', DiscountValidationResults.USUAL_SUCCESS, 3);
    await validationTest('barcodeShouldBeActive', DiscountValidationResults.USUAL_SUCCESS, 4);
    await validationTest('discountAtThisCafeteriaShouldBeFirstToday', DiscountValidationResults.USUAL_SUCCESS, 5);
    await validationTest('barcodeShouldNotBeUsedRecently', DiscountValidationResults.USUAL_SUCCESS, 6);
    await validationTest('tokenShouldBeValid', DiscountValidationResults.USUAL_SUCCESS, 7);
  });

  it('should fail token validation', async () => {
    await validationTest('tokenShouldBeValid', DiscountValidationResults.UNUSUAL_WRONG_PARAM);
  });

  it('should succeed', async () => {
    await validationTest(null, DiscountValidationResults.USUAL_SUCCESS);
  });
});

describe('# commitDiscountTransaction', () => {
  const commitTest = async function(failAt, confirm, expectation) {
    const service = getMockedService(failAt);
    const result = await service.commitDiscountTransaction({transaction: getExampleTransaction(), transactionToken: 'token', confirm: confirm});

    expect(result).toBe(expectation);
  };

  it('should fail basic commit validation', async () => {
    await commitTest('requestShouldBeNotMalformed', true, DiscountCommitResults.FAIL);
    await commitTest('requestShouldBeInMealTime', true, DiscountCommitResults.FAIL);
    await commitTest('cafeteriaShouldSupportDiscount', true, DiscountCommitResults.FAIL);
    await commitTest('userShouldExist', true, DiscountCommitResults.FAIL);
    await commitTest('barcodeShouldBeActive', true, DiscountCommitResults.FAIL);
    await commitTest('discountAtThisCafeteriaShouldBeFirstToday', true, DiscountCommitResults.FAIL);
    // await commitTest('barcodeShouldNotBeUsedRecently', true, DiscountCommitResults.FAIL);
    /** Do not check barcode time when committing! */
  });

  it('should catch null confirm', async () => {
    await commitTest(null, null, DiscountCommitResults.FAIL);
  });

  it('should fail proceeding commit: write failed', async () => {
    await commitTest('writeDiscountTransaction', true, DiscountCommitResults.FAIL);
  });

  it('should fail canceling commit: remove failed', async () => {
    await commitTest('removeDiscountTransaction', false, DiscountCommitResults.FAIL);
  });

  it('should succeed proceeding commit', async () => {
    await commitTest(null, true, DiscountCommitResults.SUCCESS);
  });

  it('should succeed canceling commit', async () => {
    await commitTest(null, false, DiscountCommitResults.SUCCESS);
  });
});

const getExampleTransaction = function() {
  return new DiscountTransaction({
    mealType: 1,
    userId: 201701562,
    cafeteriaId: 3,
  });
};

const getMockedService = function(failAt, bypass=0) {
  const service = resolve(TransactionService);

  const toMockInValidator = [
    // basic validation
    'requestShouldBeNotMalformed',
    'requestShouldBeInMealTime',
    'cafeteriaShouldSupportDiscount',
    'userShouldExist',
    'barcodeShouldBeActive',
    'discountAtThisCafeteriaShouldBeFirstToday',
    'barcodeShouldNotBeUsedRecently',

    // token validation
    'tokenShouldBeValid',
  ];

  const toMockInRepository = [
    'writeDiscountTransaction',
    'removeDiscountTransaction',
  ];

  for (let i = 0; i < toMockInValidator.length; i++) {
    const toReturn = (toMockInValidator[i] !== failAt);
    service.transactionValidator[toMockInValidator[i]] = jest.fn(() => toReturn);
  }

  for (let i = 0; i < toMockInRepository.length; i++) {
    const toReturn = (toMockInRepository[i] !== failAt);
    service.transactionRepository[toMockInRepository[i]] = jest.fn(() => toReturn);
  }

  service._isRuleEnabled = jest.fn((ruleId) => {
    return ruleId !== bypass;
  });

  return service;
};
