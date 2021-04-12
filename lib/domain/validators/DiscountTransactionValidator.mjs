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

/**
 * This class is responsible for validating a discount transaction request.
 */
class DiscountTransactionValidator {
  requestShouldBeNotMalformed(transaction) {
    throw new Error('Not implemented!');
  }

  // RULE NUMBER 1
  // Rule of cafeteria
  requestShouldBeInMealTime(cafeteriaId, mealType/* 4 or 2 or 1 */) {
    throw new Error('Not implemented!');
  }

  // RULE NUMBER 2
  // Rule of cafeteria
  cafeteriaShouldSupportDiscount(cafeteriaId) {
    throw new Error('Not implemented!');
  }

  // RULE NUMBER 3
  // Rule of user
  userShouldExist(userId) {
    throw new Error('Not implemented!');
  }

  // RULE NUMBER 4
  // Rule of user
  barcodeShouldBeActive(userId, activeDurationMinute/* in minutes */) {
    throw new Error('Not implemented!');
  }

  // RULE NUMBER 5
  // Rule of user
  discountAtThisCafeteriaShouldBeFirstToday(userId, cafeteriaId) {
    throw new Error('Not implemented!');
  }

  // RULE NUMBER 6
  // Rule of user
  barcodeShouldNotBeUsedRecently(userId, intervalSec) {
    throw new Error('Not implemented!');
  }

  // RULE NUMBER 7
  // Rule of cafeteria
  tokenShouldBeValid(cafeteriaId, plainToken) {
    throw new Error('Not implemented!');
  }
}

export default DiscountTransactionValidator;
