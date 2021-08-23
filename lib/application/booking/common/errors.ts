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

import BadRequest from '../../../common/errors/http/BadRequest';
import Forbidden from '../../../common/errors/http/Forbidden';
import Conflict from '../../../common/errors/http/Conflict';

export const InvalidTimeSlot = BadRequest.of('invalid_time_slot', '올바르지 않은 예약 시간입니다.');

export const InvalidCafeteriaId = BadRequest.of(
  'invalid_cafeteria_id',
  '올바르지 않은 식당 식별자입니다.'
);

export const NoBookingParams = BadRequest.of(
  'no_booking_params',
  '해당 식당에는 예약 관련 설정이 존재하지 않습니다.'
);

export const NoBooking = BadRequest.of('no_booking', '예약이 존재하지 않습니다.');

export const AlreadyCheckedIn = BadRequest.of(
  'already_checked_in',
  '이미 체크인한 예약은 취소할 수 없습니다.'
);

export const TimeSlotUnavailable = Conflict.of(
  'time_slot_unavailable',
  '해당 시간대는 예약할 수 없습니다.'
);

export const AlreadyBooked = Forbidden.of(
  'already_booked_with_that_option',
  '이미 해당 시간대에 예약한 내역이 존재합니다.'
);
