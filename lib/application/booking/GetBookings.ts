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
import {UserIdentifier} from '../user/common/types';
import config from '../../../config';

/**
 * 사용자의 예약 중에 예약 시간이 아직 안 지났고 & 체크인 안 한 예약을 가져옵니다.
 */
class GetBookings extends UseCase<UserIdentifier, Booking[]> {
  async onExecute({userId}: UserIdentifier): Promise<Booking[]> {
    // 어느 정도 지난 예약도 표시는 해줌.
    return await Booking.findActiveBookings(
      userId,
      config.application.booking.pastBookingDisplayToleranceMinutes,
      new Date()
    );
  }
}

export default new GetBookings();
