/**
 * This file is part of INU Cafeteria.
 *
 * Copyright 2021 INU Global App Center <potados99@gmail.com>
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

import MenuRepository from '../../lib/application/menu/MenuRepository';
import {startTypeORM} from '@inu-cafeteria/backend-core';

beforeAll(async () => {
  await startTypeORM(false);
});

describe('메뉴 가져오기', () => {
  it('처음부터 끝까지!', async () => {
    const menus = await MenuRepository.getAllMenus('20220303');

    console.log(menus);
  });
});
