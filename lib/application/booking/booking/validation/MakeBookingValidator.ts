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
  AlreadyBooked,
  InvalidCafeteriaId,
  InvalidTimeSlot,
  NoBookingParams,
  TimeSlotUnavailable,
} from '../common/errors';
import assert from 'assert';
import config from '../../../../../config';
import BookingFinder from '../finder/BookingFinder';
import {MakeBookingParams} from '../MakeBooking';
import BookingOptionFinder from '../../options/finder/BookingOptionFinder';
import {BookingStatus, Cafeteria, CafeteriaBookingParams} from '@inu-cafeteria/backend-core';

/**
 * 예약을 진행하기에 앞서 예약이 가능한지 조회합니다.
 */
export default class MakeBookingValidator {
  constructor(
    private readonly params: MakeBookingParams,
    private readonly optionsFinder = new BookingOptionFinder(),
    private readonly bookingFinder = new BookingFinder()
  ) {}

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
    const {cafeteriaId, timeSlotStart} = this.params;

    const option = await this.optionsFinder.findByCafeteriaIdAndTimeSlotStart(
      cafeteriaId,
      timeSlotStart
    );

    assert(option, InvalidTimeSlot());
  }

  private async timeSlotShouldBeAvailable() {
    const {cafeteriaId, timeSlotStart} = this.params;

    const option = await this.optionsFinder.findByCafeteriaIdAndTimeSlotStart(
      cafeteriaId,
      timeSlotStart
    );

    assert(option, InvalidTimeSlot());
    assert(option.isAvailableForBooking(), TimeSlotUnavailable());
  }

  private async shouldNotBeDuplicated() {
    const {userId, cafeteriaId} = this.params;
    const recentBookingsOfThisUser = await this.bookingFinder.findRecentBookings(
      userId,
      config.application.booking.historyInHours
    );
    const activeBookingsOfThisUser = recentBookingsOfThisUser.filter(
      (booking) => booking.status === BookingStatus.UNUSED_AVAILABLE
    );

    /**
     * 같은 식당에 또 예약 불가!
     */
    const existingOne = activeBookingsOfThisUser.find(
      (booking) => booking.cafeteriaId === cafeteriaId
    );

    assert(existingOne == null, AlreadyBooked());
  }
}
