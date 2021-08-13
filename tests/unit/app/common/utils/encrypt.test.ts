/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2021 INU Global App Center <potados99@gmail.com>
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

import {encryptForRemoteLogin} from '../../../../../lib/common/utils/encrypt';

describe('재학생 확인할 때에 쓰는 암호화 함수', () => {
  it('프로덕션에서 쓰이는 것의 결과와 같아야 함', async () => {
    const actual = encryptForRemoteLogin('abcd', 'key');
    const expected = 'DXX1d6XeJ38fYaqz3TFfrA==';

    expect(actual).toBe(expected);
  });
});
