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

import assert from 'assert';
import UseCase from '../../../common/base/UseCase';
import {Booking} from '@inu-cafeteria/backend-core';
import BookingCreator from './creator/BookingCreator';
import {UserIdentifier} from '../../user/common/types';
import BookingOptionFinder from '../options/finder/BookingOptionFinder';
import MakeBookingValidator from './validation/MakeBookingValidator';

export type MakeBookingParams = UserIdentifier & {
  cafeteriaId: number;
  timeSlotStart: Date;
};

/**
 * 예약을 생성합니다.
 */
class MakeBooking extends UseCase<MakeBookingParams, Booking> {
  async onExecute(params: MakeBookingParams): Promise<Booking> {
    await new MakeBookingValidator(params).validate();

    const {userId, cafeteriaId, timeSlotStart} = params;

    const bookingOption = await new BookingOptionFinder().findByCafeteriaIdAndTimeSlotStart(
      cafeteriaId,
      timeSlotStart
    );

    assert(bookingOption, '검증 이후에 예약 옵션이 없을 수 없습니다.');

    return await new BookingCreator({
      userId,
      cafeteriaId,
      timeSlotStart: bookingOption.timeSlotStart,
      timeSlotEnd: bookingOption.timeSlotEnd,
    }).create();
  }
}

export default new MakeBooking();
