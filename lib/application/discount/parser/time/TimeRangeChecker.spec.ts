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

import TimeRangeChecker from './TimeRangeChecker';
import {MealType} from '@inu-cafeteria/backend-core';

describe('시간대 체크', () => {
  it('만약 지금이 오후 6시이고, 검증 파라미터의 저녁 시간대에 6시가 포함된다면 저녁인 것 ', async () => {
    const nowAt6pm = new Date('2021-08-13 18:00');

    const result = new TimeRangeChecker(
      '08:30-10:00',
      '11:30-13:30',
      '17:30-20:30'
    ).getCurrentMealType(nowAt6pm);

    expect(result).toBe(MealType.DINNER);
  });

  it('만약 지금이 오후 6시이고, 검증 파라미터의 저녁 시간대가 6시에 딱 끝난다면 NONE인 것 ', async () => {
    const nowAt6pm = new Date('2021-08-13 18:00');

    const result = new TimeRangeChecker(
      '08:30-10:00',
      '11:30-13:30',
      '17:30-18:00'
    ).getCurrentMealType(nowAt6pm);

    expect(result).toBe(MealType.NONE);
  });

  it('만약 지금이 오전 8시반이고, 검증 파라미터의 아침 시간대가 8시반에 막 시작한다면 BREAKFAST인 것 ', async () => {
    const nowAt8amHalf = new Date('2021-08-13 08:30');

    const result = new TimeRangeChecker(
      '08:30-10:00',
      '11:30-13:30',
      '17:30-18:00'
    ).getCurrentMealType(nowAt8amHalf);

    expect(result).toBe(MealType.BREAKFAST);
  });
});
