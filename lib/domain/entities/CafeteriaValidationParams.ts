/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020 INU Global App Center <potados99@gmail.com>
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
import Entity from './Entity';

export type TimeRangeExpression = `${number}:${number}-${number}:${number}`;
export type MealTimeRange = {
  breakfast: TimeRangeExpression;
  lunch: TimeRangeExpression;
  dinner: TimeRangeExpression;
};

export default class CafeteriaValidationParams extends Entity<CafeteriaValidationParams> {
  cafeteriaId: number;

  /**
   * 키오스크가 할인 여부를 물어볼 때에, 이 고유한 값을 같이 보내옵니다.
   */
  token: string;

  /**
   * 할인을 지원하는 시간대입니다(아침: 4, 점심: 2, 저녁: 1).
   * 아침만 -> 4 (2^2)
   * 점심만 -> 2 (2^1)
   * 저녁만 -> 1 (2^0)
   * 점심과 저녁 -> 3 (2^1 + 2^0)
   * 유닉스 파일 권한과 비슷합니다.
   */
  availableMealTypes: number;

  /**
   * 해당 식당이 사용하는 아침/점심/저녁 구분 체계입니다.
   * 어떤 식당은 아침을 09:30부터 10:00까지 잡을 수 있고, 또 다른 식당은 08:00부터 09:00이라고 할 수 있습니다.
   */
  timeRanges: MealTimeRange;
}
