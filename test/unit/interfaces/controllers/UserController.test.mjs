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

beforeAll(async () => {
  await init(testModules);
});

describe('# User controller', () => {
  it('should login', async () => {
    const user = {
      id: '201701562',
      token: 'token',
      barcode: 'barcode',
    };

    const request = {
      payload: {
        id: '201701562',
        password: 'blah',
      },
    };

    const h = {
      response: () => ({
        header: (key, val) => {
          return key;
        },
      }),
      state: () => {},
    };

    const response = await UserController.login(request, h);

    expect(response).toEqual('Authorization');
  });

  it('should logout', async () => {
    const user = {
      id: '201701562',
      token: 'token',
      barcode: 'barcode',
    };

    const auth = {
      isAuthenticated: true,
      credentials: user,
    };

    const request = {
      auth: auth,
    };

    const h = {
      response: () => ({
        code: () => 204,
      }),
      unstate: () => {},
    };

    const response = await UserController.logout(request, h);

    expect(response).toBe(204);
  });
});
