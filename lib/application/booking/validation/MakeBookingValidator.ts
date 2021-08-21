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
  InvalidTimeSlot,
  NoBookingParams,
  InvalidCafeteriaId,
  TimeSlotUnavailable,
  AlreadyBooked,
} from '../common/errors';
import assert from 'assert';
import {isEqual} from 'date-fns';
import GetBookingOptions from '../GetBookingOptions';
import {MakeBookingParams} from '../MakeBooking';
import {Booking, Cafeteria, CafeteriaBookingParams} from '@inu-cafeteria/backend-core';
/**
 * 예약을 진행하기에 앞서 예약이 가능한지 조회합니다.
 */
export default class MakeBookingValidator {
  constructor(private readonly params: MakeBookingParams) {}

  async validate() {
    await this.cafeteriaShouldExist();
    await this.bookingParamsShouldExistForThatCafeteria();

    await this.timeSlotShouldHaveBeenSuggested();
    await this.timeSlotShouldBeAvailable();
    await this.shouldNotBeDuplicated();
  }

  private async cafeteriaShouldExist() {
    const {cafeteriaId} = this.params;

    const found = await Cafeteria.findOne(cafeteriaId);

    assert(found, InvalidCafeteriaId());
  }

  private async bookingParamsShouldExistForThatCafeteria() {
    const {cafeteriaId} = this.params;

    const found = await CafeteriaBookingParams.findOne({cafeteriaId});

    assert(found, NoBookingParams());
  }

  private async timeSlotShouldHaveBeenSuggested() {
    const {cafeteriaId, timeSlot} = this.params;

    const allOptions = await GetBookingOptions.run({cafeteriaId});
    const allTimeSlots = allOptions.map((o) => o.timeSlot);

    const timeSlowHasBeenSuggested = allTimeSlots
      .map((ts) => ts.getTime())
      .includes(timeSlot.getTime());

    assert(timeSlowHasBeenSuggested, InvalidTimeSlot());
  }

  private async timeSlotShouldBeAvailable() {
    const {cafeteriaId, timeSlot} = this.params;

    const allOptions = await GetBookingOptions.run({cafeteriaId});
    const specifiedOption = allOptions.find((o) => o.timeSlot.getTime() === timeSlot.getTime());

    assert(specifiedOption, InvalidTimeSlot());
    assert(specifiedOption.isAvailable(), TimeSlotUnavailable());
  }

  private async shouldNotBeDuplicated() {
    const {userId, cafeteriaId, timeSlot} = this.params;
    const activeBookingsOfThisUser = await Booking.findActiveBookings(userId);

    const existingOne = activeBookingsOfThisUser.find(
      (booking) => booking.cafeteriaId === cafeteriaId && isEqual(booking.timeSlot, timeSlot)
    );

    assert(existingOne == null, AlreadyBooked());
  }
}
