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

import {MoreThan} from 'typeorm';
import {subHours} from 'date-fns';
import {BaseBookingFinder, Booking} from '@inu-cafeteria/backend-core';

export default class BookingFinder extends BaseBookingFinder {
  /**
   * 최근 inHours 시간 내의 예약을 최신 순으로 모두 가져옵니다.
   * 예약의 상태는 따지지 않습니다. 그냥 일단 다 가져옵니다.
   * relations에 user와 checkIn이 들어 있는 것이 특징입니다. checkIn은 상태 판단에 써야 하므로 꼭 가져옵니다.
   *
   * @param userId
   * @param inHours
   */
  async findRecentBookings(userId: number, inHours: number = 72): Promise<Booking[]> {
    return await Booking.find({
      where: {
        userId: userId,
        bookedAt: MoreThan(subHours(new Date(), inHours)), // "inHours 시간 이전" 이후(=inHours 시간 내)
      },
      relations: this.allRelations,
      order: {
        bookedAt: 'DESC', // 최신 순으로
      },
    });
  }

  /**
   * 예약 식별자와 사용자 식별자로 특정한 사용자의 특정한 예약을 가져옵니다.
   *
   * @param bookingId 예약 식별자.
   * @param userId 사용자 식별자.
   */
  async findByBookingIdAndUserId(bookingId: number, userId: number): Promise<Booking | undefined> {
    return Booking.findOne({
      where: {id: bookingId, userId},
      relations: this.allRelations,
    });
  }
}
