/**
 * This file is part of INU Cafeteria.
 *
 * Copyright 2022 INU Global App Center <potados99@gmail.com>
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

import express from 'express';
import GetBookings from './GetBookings';
import BookingMapper from './mapper/BookingMapper';
import {logger, ConnectionPool} from '@inu-cafeteria/backend-core';

class RealTimeBookingService {
  private pool = new ConnectionPool();

  /**
   * 어느 사용자의 예약 내역 listener를 등록합니다.
   *
   * @param userId 사용자 식별자.
   * @param res 응답 객체.
   */
  addBookingsListener(userId: number, res: express.Response) {
    this.pool.add(`user_${userId}`, res);
  }

  /**
   * 어느 사용자에게 예약 내역을 방출합니다.
   *
   * @param userId 사용자 식별자.
   */
  async emitBookings(userId: number) {
    try {
      logger.info(`사용자 ${userId}의 예약 내역을 방출합니다.`);

      const allBookings = await GetBookings.run({userId});
      const bookingResponses = BookingMapper.toBookingResponse(allBookings);

      await this.pool.broadcast(`user_${userId}`, 'bookings', bookingResponses);
    } catch (e) {
      logger.error(`사용자 ${userId}의 예약 내역 방출 실패: ${e}`);
    }
  }
}

export default new RealTimeBookingService();
