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

import {DiscountTransaction} from '@inu-cafeteria/backend-core';

export default interface DiscountRules {
  requestShouldBeNotMalformed(transaction: DiscountTransaction): boolean;

  /**
   * RULE NUMBER 1
   */
  requestShouldBeInMealTime(cafeteriaId: number, mealType: number): Promise<boolean>;

  /**
   * RULE NUMBER 2
   */
  cafeteriaShouldSupportDiscount(cafeteriaId: number): Promise<boolean>;

  /**
   * RULE NUMBER 3
   */
  userShouldExist(studentId: string): Promise<boolean>;

  /**
   * RULE NUMBER 4
   */
  barcodeShouldBeActive(
    studentId: string,
    activeDurationMinute: number /* in minutes */
  ): Promise<boolean>;

  /**
   * RULE NUMBER 5
   */
  discountAtThisCafeteriaShouldBeFirstToday(
    studentId: string,
    cafeteriaId: number
  ): Promise<boolean>;

  /**
   * RULE NUMBER 6
   */
  barcodeShouldNotBeUsedRecently(studentId: string, intervalSec: number): Promise<boolean>;

  /**
   * RULE NUMBER 7
   */
  tokenShouldBeValid(cafeteriaId: number, plainToken: string): Promise<boolean>;
}
