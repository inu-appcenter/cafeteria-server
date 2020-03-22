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
  const validationTest = async function(failAt, expectation) {
    const service = getMockedService(failAt);
    const result = await service.validateDiscountTransaction({transaction: getExampleTransaction(), transactionToken: 'abcd'});

    expect(result).toBe(expectation);
  };

  it('should throw on null param', async () => {
    const service = resolve(TransactionService);

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
    await validationTest('isNotMalformed', DiscountValidationResults.UNUSUAL_WRONG_PARAM);
    await validationTest('isInMealTime', DiscountValidationResults.USUAL_FAIL);
    await validationTest('cafeteriaSupportsDiscount', DiscountValidationResults.UNUSUAL_WRONG_PARAM);
    await validationTest('userExists', DiscountValidationResults.UNUSUAL_NO_BARCODE);
    await validationTest('isBarcodeActive', DiscountValidationResults.USUAL_FAIL);
    await validationTest('isFirstToday', DiscountValidationResults.USUAL_FAIL);
    await validationTest('barcodeNotUsedRecently', DiscountValidationResults.USUAL_FAIL);
    await validationTest('isTokenValid', DiscountValidationResults.UNUSUAL_WRONG_PARAM);
  });

  it('should fail token validation', async () => {
    await validationTest('isTokenValid', DiscountValidationResults.UNUSUAL_WRONG_PARAM);
  });

  it('should succeed', async () => {
    await validationTest(null, DiscountValidationResults.USUAL_SUCCESS);
  });
});

describe('# commitDiscountTransaction', () => {
  const commitTest = async function(failAt, confirm, expectation) {
    const service = getMockedService(failAt);
    const result = await service.commitDiscountTransaction({transaction: getExampleTransaction(), confirm: confirm});

    expect(result).toBe(expectation);
  };

  it('should fail basic validation', async () => {
    await commitTest('isNotMalformed', true, DiscountCommitResults.FAIL);
    await commitTest('isInMealTime', true, DiscountCommitResults.FAIL);
    await commitTest('cafeteriaSupportsDiscount', true, DiscountCommitResults.FAIL);
    await commitTest('userExists', true, DiscountCommitResults.FAIL);
    await commitTest('isBarcodeActive', true, DiscountCommitResults.FAIL);
    await commitTest('isFirstToday', true, DiscountCommitResults.FAIL);
    await commitTest('barcodeNotUsedRecently', true, DiscountCommitResults.FAIL);
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

const getMockedService = function(failAt) {
  const service = resolve(TransactionService);

  const toMockInValidator = [
    // basic validation
    'isNotMalformed',
    'isInMealTime',
    'cafeteriaSupportsDiscount',
    'userExists',
    'isBarcodeActive',
    'isFirstToday',
    'barcodeNotUsedRecently',

    // token validation
    'isTokenValid',
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

  return service;
};
