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

import DirectMenuConverter from '../../../../lib/interfaces/converters/DirectMenuConverter';
import CafeteriaRepositoryMock from '../../../mocks/CafeteriaRepositoryMock';
import fetch from '../../../../lib/common/utils/fetch';

describe('# From HTML to JSON', () => {
  it('should fetch', async () => {
    const converter = new DirectMenuConverter();
    const repo = new CafeteriaRepositoryMock();

    const rawHtml = await fetch.getHtml('https://www.uicoop.ac.kr/main.php?mkey=2&w=4&sdt=20200907');

    converter.convert({
      cafeteria: repo.getAllCafeteria(),
      corners: repo.getAllCorners(),
      rawHtml: rawHtml,
    });
  });
});
