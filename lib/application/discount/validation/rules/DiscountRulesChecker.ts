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

import DiscountRules from './DiscountRules';
import {DiscountTransaction} from '@inu-cafeteria/backend-core';

// TODO

class DiscountRulesChecker implements DiscountRules {
  requestShouldBeNotMalformed(transaction: DiscountTransaction): boolean {
    return false;
  }

  async requestShouldBeInMealTime(cafeteriaId: number, mealType: number): Promise<boolean> {
    return false;
  }

  async cafeteriaShouldSupportDiscount(cafeteriaId: number): Promise<boolean> {
    return false;
  }

  async userShouldExist(studentId: string): Promise<boolean> {
    return false;
  }

  async barcodeShouldBeActive(
    studentId: string,
    activeDurationMinute: number /* in minutes */
  ): Promise<boolean> {
    return false;
  }

  async discountAtThisCafeteriaShouldBeFirstToday(
    studentId: string,
    cafeteriaId: number
  ): Promise<boolean> {
    return false;
  }

  async barcodeShouldNotBeUsedRecently(studentId: string, intervalSec: number): Promise<boolean> {
    return false;
  }

  async tokenShouldBeValid(cafeteriaId: number, plainToken: string): Promise<boolean> {
    return false;
  }
}

export default new DiscountRulesChecker();
