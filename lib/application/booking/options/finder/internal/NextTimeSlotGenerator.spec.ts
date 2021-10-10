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

import MockDate from 'mockdate';
import NextTimeSlotGenerator from './NextTimeSlotGenerator';
import {BookingTimeRange, CafeteriaBookingParams} from '@inu-cafeteria/backend-core';

describe('예약 옵션 가져오기', () => {
  afterEach(() => {
    MockDate.reset();
  });

  const timeRangeEarly = new BookingTimeRange();
  timeRangeEarly.timeRange = '08:30-08:55';
  timeRangeEarly.intervalMinutes = 5;
  timeRangeEarly.capacity = 55;

  const timeRangeLate = new BookingTimeRange();
  timeRangeLate.timeRange = '09:00-10:00';
  timeRangeLate.intervalMinutes = 5;
  timeRangeLate.capacity = 35;

  const params = new CafeteriaBookingParams();
  params.timeRanges = [timeRangeEarly, timeRangeLate];

  const generate = () => new NextTimeSlotGenerator(params, []).getTimeSlotsInBusinessHour();

  it('오늘이 휴일이면 10시 전에는 아무 것도 표시 안함.', async () => {
    MockDate.set('2021-09-26 09:26:30'); // 일요일

    const timeSlots = await generate();

    expect(timeSlots.length).toBe(0);
  });

  it('오늘이 휴일이면 10시 이후에 다음날 것 표시하는데, 담날도 휴일이면 아무 것도 표시 안함.', async () => {
    MockDate.set('2021-09-25 11:26:30'); // 토요일

    const timeSlots = await generate();

    expect(timeSlots.length).toBe(0);
  });

  it('오늘이 휴일이면 10시 이후에 다음날 것 표시하는데, 담날이 평일이면 다 표시함.', async () => {
    MockDate.set('2021-09-26 11:26:30'); // 일요일

    const timeSlots = await generate();

    expect(timeSlots.length).toBe(19); // 8시 30분 부터 10시 0분까지 총 19개
  });

  it('평일 느즈막한 오전 즈음에는 아직 지나지 않은 시간대만 표시함.', async () => {
    MockDate.set('2021-09-27 9:26:30'); // 월요일

    const timeSlots = await generate();

    expect(timeSlots.length).toBe(8); // 9시 25분 부터 10시 0분까지 총 8개
  });

  it('시간에 따라 예약 정원이 달라야 함.', async () => {
    MockDate.set('2021-09-27 4:26:30'); // 월요일 새벽, 당일 모든 예약 옵션이 보임.

    const timeSlots = await generate();

    expect(timeSlots[0].capacity).toBe(55);
    expect(timeSlots[timeSlots.length - 1].capacity).toBe(35);
  });

  it('휴일에는 아무것도 안 가져옴.', async () => {
    MockDate.set('2021-08-16 4:26:30'); // 광복절 대체휴일.

    const timeSlots = await generate();

    expect(timeSlots.length).toBe(0); // 휴일이라 없음.
  });
});
