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

import {
  BookingTimeSlot,
  CafeteriaDayOff,
  CafeteriaBookingParams,
} from '@inu-cafeteria/backend-core';
import {getNextDay} from '../../../../../common/utils/date';
import {areIntervalsOverlapping, isFuture, isWeekend} from 'date-fns';

/**
 * 다음 예약 가능한(사용자에게 표시할) 타임슬롯을 만들어 가져옵니다.
 */
export default class NextTimeSlotGenerator {
  constructor(
    private readonly bookingParams: CafeteriaBookingParams,
    private readonly dayOffs?: CafeteriaDayOff[]
  ) {}

  /**
   * 예약 가능한 미래의 타임슬롯을 모두 가져옵니다.
   *
   * 예약이 가능하다 함은, 주말이 아니며 휴업 시간이 아님을 뜻합니다.
   * 미래라 함은, 해당 예약 시간이 아직 지나지 않았음을 뜻합니다.
   *
   * 오늘 모든 예약 운영이 종료되었으면 다음 날의 타임 슬롯을 가져옵니다.
   * 설령 다음 날이 휴일이거나 하루 종일 휴업이더라도 해당 날짜를 기준으로 빈 배열만 가져옵니다.
   */
  async getTimeSlotsInBusinessHour(): Promise<BookingTimeSlot[]> {
    const now = new Date();
    const baseDate = this.bookingParams.isOverToday() ? getNextDay(now) : now;

    const offs =
      this.dayOffs ??
      (await CafeteriaDayOff.findByCafeteriaIdAtSameDay(this.bookingParams.cafeteriaId, baseDate));

    const isNotWeekend = (slot: BookingTimeSlot) => !isWeekend(slot.start);
    const isNotOffTime = (slot: BookingTimeSlot) =>
      offs.find((off) =>
        areIntervalsOverlapping(
          {start: slot.start, end: slot.end},
          {start: off.startsAt, end: off.endsAt}
        )
      ) == null;
    const isNotOver = (slot: BookingTimeSlot) => isFuture(slot.end);

    return this.bookingParams
      .getAllTimeSlots(baseDate)
      .filter(isNotWeekend)
      .filter(isNotOffTime)
      .filter(isNotOver);
  }
}
