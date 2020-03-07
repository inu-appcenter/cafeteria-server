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

beforeAll(async () => {
  await init(testModules);
});

describe('# User controller', () => {
  it('should login', async () => {
    const request = requestMock.getRequest({
      payload: {
        id: '201701562',
        password: 'blah',
      },
    });

    const response = await UserController.login(request, requestMock.getH());

    expect(response.header.key).toEqual('Authorization');
  });

  it('should logout', async () => {
    const request = requestMock.getRequest({auth: true});

    const response = await UserController.logout(request, requestMock.getH());

    expect(response.code).toBe(204);
  });
});
