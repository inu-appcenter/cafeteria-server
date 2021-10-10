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

import {generateUUID} from '../../../../common/utils/uuid';
import {Booking, BookingTimeSlot, logger} from '@inu-cafeteria/backend-core';

export type CreateBookingParams = {
  userId: number;
  cafeteriaId: number;
  timeSlotStart: Date;
  timeSlotEnd: Date;
};

/**
 * 예약을 생성해주는 친구입니다.
 */
export default class BookingCreator {
  constructor(private readonly params: CreateBookingParams) {}

  async create() {
    logger.info(
      `ID가 ${
        this.params.userId
      }인 사용자가 ${this.params.timeSlotStart.toLocaleTimeString()}에 ID가 ${
        this.params.cafeteriaId
      }인 식당에 입장하는 예약을 생성합니다.`
    );

    return await Booking.create({
      uuid: generateUUID(),
      userId: this.params.userId,
      cafeteriaId: this.params.cafeteriaId,
      timeSlotStart: this.params.timeSlotStart,
      timeSlotEnd: this.params.timeSlotEnd,
      bookedAt: new Date(),
    }).save();
  }
}
