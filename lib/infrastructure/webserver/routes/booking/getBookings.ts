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

import GetBookings from '../../../../application/booking/booking/GetBookings';
import BookingMapper from '../../../../application/booking/booking/mapper/BookingMapper';
import {stringAsBoolean} from '@inu-cafeteria/backend-core';
import RealTimeBookingService from '../../../../application/booking/booking/RealTimeBookingService';
import {defineRoute, defineSchema} from '@inu-cafeteria/backend-core';

const schema = defineSchema({
  query: {
    sse: stringAsBoolean.optional(),
  },
});

export default defineRoute('get', '/booking/bookings', schema, async (req, res) => {
  const userId = req.requireUserId();
  const {sse} = req.query;

  if (sse === true) {
    RealTimeBookingService.addBookingsListener(userId, res);

    return await RealTimeBookingService.emitBookings(userId);
  } else {
    const allBookings = await GetBookings.run({userId});

    return res.json(BookingMapper.toBookingResponse(allBookings));
  }
});
