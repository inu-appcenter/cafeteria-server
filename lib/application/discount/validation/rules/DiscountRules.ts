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

import {DiscountTransaction} from '@inu-cafeteria/backend-core';

export default interface DiscountRules {
  requestShouldBeNotMalformed(transaction: DiscountTransaction): Promise<boolean>;

  /**
   * RULE NUMBER 1
   */
  cafeteriaShouldSupportDiscount(cafeteriaId: number): Promise<boolean>;

  /**
   * RULE NUMBER 2
   */
  requestShouldBeInMealTime(cafeteriaId: number, mealType: number): Promise<boolean>;

  /**
   * RULE NUMBER 3
   */
  userShouldExist(studentId: string): Promise<boolean>;

  /**
   * RULE NUMBER 4
   */
  barcodeShouldBeActive(studentId: string, activeDurationMinutes: number): Promise<boolean>;

  /**
   * RULE NUMBER 5
   */
  barcodeShouldNotBeUsedRecently(studentId: string, intervalSec: number): Promise<boolean>;

  /**
   * RULE NUMBER 6
   */
  discountAtThisCafeteriaShouldBeFirstToday(
    studentId: string,
    cafeteriaId: number
  ): Promise<boolean>;
}
