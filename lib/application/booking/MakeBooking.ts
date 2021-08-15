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

import UseCase from '../../common/base/UseCase';
import {Booking} from '@inu-cafeteria/backend-core';
import {generateUUID} from '../../common/utils/uuid';
import {UserIdentifier} from '../user/common/types';
import BookingValidator from './validation/BookingValidator';

export type MakeBookingParams = UserIdentifier & {
  cafeteriaId: number;
  timeSlot: Date;
};

class MakeBooking extends UseCase<MakeBookingParams, Booking> {
  async onExecute(params: MakeBookingParams): Promise<Booking> {
    await new BookingValidator(params).validate();

    const {userId, cafeteriaId, timeSlot} = params;

    return await Booking.create({
      uuid: generateUUID(),
      userId,
      cafeteriaId,
      timeSlot,
      bookedAt: new Date(),
    }).save();
  }
}

export default new MakeBooking();
