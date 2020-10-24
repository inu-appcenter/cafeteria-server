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

import CoopRepositoryImpl from '../../../../lib/interfaces/storage/CoopRepositoryImpl';
import config from '../../../../config';

describe('# visit coop', () => {
  it('should succeed', async () => {
    const repo = new CoopRepositoryImpl();

    const response = await repo.visit({
      url: config.menu.url,
    });

    expect(response.includes('자동등록방지를 위해 보안절차를 거치고 있습니다.')).toBe(false);
  });
});
