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

import {init} from '../../../../lib/common/di/resolve';
import testModules from '../../../testModules';

import UserController from '../../../../lib/interfaces/controllers/UserController';
import requestMock from './requestMock';
import Boom from '@hapi/boom';

beforeAll(async () => {
  await init(testModules);
});

describe('# User controller', () => {
  it('should login', async () => {
    const response = await doLoginAndGetActual('201701562', null, '1234');
    const expected = requestMock.getH()
      .state('token', 'my-jwt')
      .header('Authorization', 'my-jwt')
      .response({
        id: '201701562',
        token: 'my-remember-me-token',
        barcode: 'my-barcode',
      });

    expect(response).toEqual(expected);
  });

  it('should fail login without id', async () => {

  });

  it('should logout', async () => {
    const response = await doLogoutAndGetActual('201701562');
    const expected = requestMock.getH()
      .code(204)
      .state('token', 'expired');

    expect(response).toEqual(expected);
  });

  it('should fail logout without auth', async () => {
    const response = await doLogoutAndGetActual(null);
    const expected = Boom.Boom;

    expect(response).toBeInstanceOf(expected);
  });
});

function doLoginAndGetActual(id, token, password) {
  const request = requestMock.getRequest({
    payload: {
      id: id,
      token: token,
      password: password,
    },
  });

  return UserController.login(request, requestMock.getH());
}

function doLogoutAndGetActual(id) {
  const request = requestMock.getRequest({
    includeAuth: !!id,
    id: id,
  });

  return UserController.logout(request, requestMock.getH());
}
