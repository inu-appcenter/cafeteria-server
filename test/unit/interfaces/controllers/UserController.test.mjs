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

import {init, mockOnce} from '../../../../lib/common/di/resolve';

import UserController from '../../../../lib/interfaces/controllers/UserController';
import requestMock from './requestMock';
import Boom from '@hapi/boom';
import UseCase from '../../../../lib/domain/usecases/UseCase';
import Login from '../../../../lib/domain/usecases/Login';
import LoginResults from '../../../../lib/domain/constants/LoginResults';
import modules from '../../../../lib/common/di/modules';
import GetUser from '../../../../lib/domain/usecases/GetUser';
import User from '../../../../lib/domain/entities/User';

beforeAll(async () => {
  await init(modules);
});

describe('# Login', () => {
  const createMockedResponse = function(useCaseReturn, payload={}, params={}, query={}, credentials=null) {
    const request = requestMock.getRequest({payload, params, query, credentials});

    mockOnce(Login, new (class LoginMock extends UseCase {
      async onExecute({id, token, password}) {
        return useCaseReturn;
      }
    }));

    return UserController.login(request, requestMock.getH());
  };

  it('should fail with WRONG_AUTH', async () => {
    const response = await createMockedResponse(LoginResults.WRONG_AUTH);

    expect(response).toBeInstanceOf(Boom.Boom);
  });

  it('should fail with INVALID_TOKEN', async () => {
    const response = await createMockedResponse(LoginResults.INVALID_TOKEN);

    expect(response).toBeInstanceOf(Boom.Boom);
  });

  it('should fail with NOT_SUPPORTED', async () => {
    const response = await createMockedResponse(LoginResults.NOT_SUPPORTED);

    expect(response).toBeInstanceOf(Boom.Boom);
  });

  it('should fail with FUCK', async () => {
    const response = await createMockedResponse(LoginResults.FUCK);

    expect(response).toBeInstanceOf(Boom.Boom);
  });

  it('should fail with unknown return', async () => {
    const response = await createMockedResponse(0xDEAD);

    expect(response).toBeInstanceOf(Boom.Boom);
  });

  it('should succeed', async () => {
    mockOnce(GetUser, new (class GetUserMock extends UseCase {
      async onExecute({id}) {
        if (id !== 201701562) {
          throw new Error();
        }

        return new User({
          id: id,
          token: 'token',
          barcode: 'barcode',
        });
      }
    }));

    const response = await createMockedResponse(
      {result: LoginResults.SUCCESS, jwt: 'abcde'},
      {id: 201701562},
      );

    expect(response.responseResult).toEqual({
      'id': 201701562,
      'token': 'token',
      'barcode': 'barcode',
    });
    expect(response.cookieResult).toEqual({
      'key': 'token',
      'val': 'abcde',
    });
    expect(response.headerResult).toEqual({
      'key': 'Authorization',
      'val': 'abcde',
    });
  });
});
