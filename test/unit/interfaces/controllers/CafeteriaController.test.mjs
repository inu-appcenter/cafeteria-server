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
import testModels from '../../../testModules';

import CafeteriaController from '../../../../lib/interfaces/controllers/CafeteriaController';

beforeAll(async () => {
  await init(testModels, false, false);
});

describe('# Cafeteria controller', () => {
  it('should get cafeteria with id 2.', async () => {
    const request = {params: {id: 2}};

    const response = await CafeteriaController.getCafeteria(request);

    expect(response.id).toBe(2);
  });

  it('should get corner with id 3.', async () => {
    const request = {params: {id: 3}, query: {}};
    const response = await CafeteriaController.getCorners(request);

    expect(response.id).toEqual(3);
  });

  it('should get menus at 20200219 of corner with id 18.', async () => {

    const request = {params: {}, query: {cornerId: 18, date: '20200219'}};
    const response = await CafeteriaController.getMenus(request);

    expect(response[0]['corner-id']).toEqual(18);
  });
});
