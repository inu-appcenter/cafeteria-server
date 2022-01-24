/**
 * This file is part of INU Cafeteria.
 *
 * Copyright 2021 INU Global App Center <potados99@gmail.com>
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
import BookingFinder from './finder/BookingFinder';
import {UserIdentifier} from '../../user/common/types';
import {AlreadyCheckedIn, NoBooking} from './common/errors';

export type CancelBookingParams = UserIdentifier & {
  bookingId: number;
};

/**
 * 예약을 취소합니다.
 * 이미 체크인한 예약은 취소 못합니다.
 */
class CancelBooking extends UseCase<CancelBookingParams, void> {
  async onExecute({userId, bookingId}: CancelBookingParams): Promise<void> {
    const booking = await new BookingFinder().findByBookingIdAndUserId(bookingId, userId);

    assert(booking, NoBooking());
    assert(booking.checkIn == null, AlreadyCheckedIn());

    await booking.remove();
  }
}

export default new CancelBooking();
