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

import {CafeteriaValidationParams} from '@inu-cafeteria/backend-core';
import TimeRangeChecker from '../../../parser/time/TimeRangeChecker';
import MealType from '@inu-cafeteria/backend-core/dist/src/core/menu/MealType';

export type MealTypeValidatorParams = {
  mealType: number;
  discountValidationParams: CafeteriaValidationParams;
};

/**
 * 복잡한 식사시간 검증 로직 여기에 때려넣자!
 */
export default class MealTypeValidator {
  constructor(private readonly params: MealTypeValidatorParams) {}

  shouldBeInMealTime(): boolean {
    return this.mealTypeShouldBeSupported() && this.mealTypeShouldBeTruthy();
  }

  /**
   * 요청에 들어있는 mealType이 이 식당에서 지원되어야 합니다.
   */
  private mealTypeShouldBeSupported() {
    const {mealType, discountValidationParams} = this.params;

    // mealType이 4, 2, 1, 0 중에 하나여야 합니다.
    if (!MealType.all.includes(mealType)) {
      return false;
    }

    // 그리고 식당이 지원하는 mealType 중에 하나여야 합니다.
    return !!(mealType & discountValidationParams.availableMealTypes);
  }

  /**
   * 요청에 들어있는 mealType이 진짜여야 합니다.
   * 예를 들어 오후 9시에 mealType 4(아침)로 요청을 보내면 가짜!
   */
  private mealTypeShouldBeTruthy() {
    const {mealType, discountValidationParams} = this.params;

    // 현재 시간으로부터 도출한 mealType이랑
    const currentMealType = new TimeRangeChecker(
      discountValidationParams.timeRanges
    ).getCurrentMealType();

    // 요청에 들어있는 mealType이랑 같아야 함!
    return mealType === currentMealType;
  }
}
