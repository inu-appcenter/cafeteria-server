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

import BookingFinder from '../../../booking/finder/BookingFinder';
import NextTimeSlotGenerator from './NextTimeSlotGenerator';
import {BookingOption, BookingTimeSlot, CafeteriaBookingParams} from '@inu-cafeteria/backend-core';

/**
 * 식당 예약 파라미터로부터 예약 옵션을 만들어 주는 친구입니다.
 */
export default class BookingOptionBuilder {
  constructor(private readonly bookingParams: CafeteriaBookingParams) {}

  private bookingFinder = new BookingFinder();

  /**
   * 예약 파라미터로부터 예약 옵션을 모두 만들어 냅니다.
   */
  async buildAll(): Promise<BookingOption[]> {
    const timeSlots = await new NextTimeSlotGenerator(
      this.bookingParams
    ).getTimeSlotsInBusinessHour();

    return await Promise.all(timeSlots.map((slot) => this.buildOne(slot)));
  }

  /**
   * 예약 파라미터와 하나의 타임슬롯으로부터 예약 옵션을 하나 만들어 냅니다.
   *
   * @param timeSlot 타임슬롯.
   */
  private async buildOne(timeSlot: BookingTimeSlot): Promise<BookingOption> {
    const existingBookingsAtThatTimeSlot =
      await this.bookingFinder.findAllByCafeteriaIdAndTimeSlotStart(
        this.bookingParams.cafeteriaId,
        timeSlot.start
      );

    return BookingOption.create({
      cafeteriaId: this.bookingParams.cafeteriaId,
      timeSlotStart: timeSlot.start,
      timeSlotEnd: timeSlot.end,
      capacity: timeSlot.capacity,
      reserved: existingBookingsAtThatTimeSlot.length,
    });
  }
}
