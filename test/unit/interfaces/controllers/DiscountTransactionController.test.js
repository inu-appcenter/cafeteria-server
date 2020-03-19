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

import {init, overrideOnce} from '../../../../lib/common/di/resolve';

import DiscountTransactionController from '../../../../lib/interfaces/controllers/DiscountTransactionController';
import requestMock from './requestMock';
import ActivateBarcode from '../../../../lib/domain/usecases/ActivateBarcode';
import UseCase from '../../../../lib/domain/usecases/UseCase';
import modules from '../../../../lib/common/di/modules';
import Boom from '@hapi/boom';
import ValidateDiscountTransaction from '../../../../lib/domain/usecases/ValidateDiscountTransaction';
import DiscountValidationResults from '../../../../lib/domain/constants/DiscountValidationResults';
import CommitDiscountTransaction from '../../../../lib/domain/usecases/CommitDiscountTransaction';
import DiscountCommitResults from '../../../../lib/domain/constants/DiscountCommitResults';

beforeAll(async () => {
  await init(modules);
});

describe('# Barcode activation', () => {
  const createMockedResponse = function(useCaseReturn) {
    const request = requestMock.getRequest({includeAuth: true});

    overrideOnce(ActivateBarcode, new (class ActivateBarcodeMock extends UseCase {
      onExecute(param) {
        return useCaseReturn;
      }
    }));

    return DiscountTransactionController.activateBarcode(request, requestMock.getH());
  };

  it('should fail', async () => {
    const response = await createMockedResponse(false);

    expect(response).toBeInstanceOf(Boom.Boom);
  });

  it('should success', async () => {
    const response = await createMockedResponse(true);

    expect(response.codeResult).toBe(204);
  });
});

describe('# Discount availability check', () => {
  const createMockedResponse = function(useCaseReturn) {
    const request = requestMock.getRequest({query: {}});

    overrideOnce(ValidateDiscountTransaction, new (class ValidateDiscountTransactionMock extends UseCase {
      onExecute({transaction, token}) {
        return useCaseReturn;
      }
    }));

    return DiscountTransactionController.checkDiscountAvailability(request, requestMock.getH());
  };

  it('should fail with USUAL_FAIL', async () => {
    const response = await createMockedResponse(DiscountValidationResults.USUAL_FAIL);

    expect(response.codeResult).toBe(200);
    expect(response.responseResult).toEqual({message: 'SUCCESS', activated: 0});
  });

  it('should fail with UNUSUAL_NO_BARCODE', async () => {
    const response = await createMockedResponse(DiscountValidationResults.UNUSUAL_NO_BARCODE);

    expect(response.codeResult).toBe(400);
    expect(response.responseResult).toEqual({message: 'BARCODE_ERROR'});
  });

  it('should fail with UNUSUAL_WRONG_PARAM', async () => {
    const response = await createMockedResponse(DiscountValidationResults.UNUSUAL_WRONG_PARAM);

    expect(response.codeResult).toBe(400);
    expect(response.responseResult).toEqual({message: 'Parameter_Error'});
  });

  it('should fail with unknown return', async () => {
    const response = await createMockedResponse('FUCK');

    expect(response).toBeInstanceOf(Boom.Boom);
  });

  it('should success with USUAL_SUCCESS', async () => {
    const response = await createMockedResponse(DiscountValidationResults.USUAL_SUCCESS);

    expect(response.codeResult).toBe(200);
    expect(response.responseResult).toEqual({message: 'SUCCESS', activated: 1});
  });
});

describe('# Commit discount transaction', () => {
  const createMockedResponse = function(useCaseReturn) {
    const request = requestMock.getRequest({query: {}});

    overrideOnce(CommitDiscountTransaction, new (class CommitDiscountTransactionMock extends UseCase {
      onExecute({transaction, confirm}) {
        return useCaseReturn;
      }
    }));

    return DiscountTransactionController.commitDiscountTransaction(request, requestMock.getH());
  };

  it('should fail with ALREADY_DISCOUNTED', async () => {
    const response = await createMockedResponse(DiscountCommitResults.ALREADY_DISCOUNTED);

    expect(response.codeResult).toBe(200);
    expect(response.responseResult).toEqual({message: 'Already_Discounted'});
  });

  it('should fail with FAIL', async () => {
    const response = await createMockedResponse(DiscountCommitResults.FAIL);

    expect(response.codeResult).toBe(200);
    expect(response.responseResult).toEqual({message: 'ERROR'});
  });

  it('should succeed with SUCCESS', async () => {
    const response = await createMockedResponse(DiscountCommitResults.SUCCESS);

    expect(response.codeResult).toBe(200);
    expect(response.responseResult).toEqual({message: 'SUCCESS'});
  });
});
