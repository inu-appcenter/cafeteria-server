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
import {BookingOption} from '@inu-cafeteria/backend-core';

export type GetBookingOptionsParams = {
  /**
   * 식당 식별자. 없으면 모두 가져옵니다.
   */
  cafeteriaId?: number;
};

/**
 * 현재 시각 기준으로 지정된(또는 모든) 식당에 대해 사용자에게 보여줄 예약 옵션들을 가져옵니다.
 *
 * 오늘 마지막 타임이 지나지 않았으면 오늘 옵션을, 아니면 다음 영업일 옵션을 가져옵니다.
 * 오늘 옵션을 가져올 때, 이미 시간이 지나서 선택 불가능한 옵션은 가져오지 않습니다.
 */
class GetBookingOptions extends UseCase<GetBookingOptionsParams, BookingOption[]> {
  async onExecute({cafeteriaId}: GetBookingOptionsParams): Promise<BookingOption[]> {
    if (cafeteriaId == null) {
      return await BookingOption.findAll();
    } else {
      return await BookingOption.findByCafeteriaId(cafeteriaId);
    }
  }
}

export default new GetBookingOptions();
