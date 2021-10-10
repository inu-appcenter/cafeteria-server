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

import {setupLogger} from '@inu-cafeteria/backend-core';
import holidayChecker from './HolidayChecker';

describe('휴일인지 확인하기', () => {
  beforeAll(async () => {
    setupLogger({});

    await holidayChecker.fetchIfNeeded();
  });

  it('20210815 휴일', async () => {
    const actual = holidayChecker.isHoliday(new Date('2021-08-15'));
    const expected = true;

    expect(actual).toBe(expected);
  });

  it('20210816 대체휴일', async () => {
    const actual = holidayChecker.isHoliday(new Date('2021-08-16'));
    const expected = true;

    expect(actual).toBe(expected);
  });

  it('20210817 평일', async () => {
    const actual = holidayChecker.isHoliday(new Date('2021-08-17'));
    const expected = false;

    expect(actual).toBe(expected);
  });
});
