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

import DiscountTransactionController from '../../../../lib/interfaces/controllers/DiscountTransactionController';
import requestMock from './requestMock';

beforeAll(async () => {
  await init(testModules);
});

const h = {
  response: (object) => ({
    code: (c) => ({model: object, code: c}),
  }),
};

describe('# Discount transaction controller', () => {
  it('should activate barcode', async () => {
    const request = {
      auth: {
        credentials: {
          id: 201701562,
        },
      },
    };

    const response = await DiscountTransactionController.activateBarcode(request, h);

    expect(response.code).toBe(204);
  });

  it('it shoud check discount availability', async () => {

    const request = requestMock.getRequest(
      null,
      {
        barcode: '1210209372', /* 201701562 */
        code: 1,
        menu: 'blahblah',
      }, true);

    const response = await DiscountTransactionController.checkDiscountAvailability(request, requestMock.getH());

    expect(response.model).toEqual({message: 'SUCCESS', activated: 1});

  });


});
