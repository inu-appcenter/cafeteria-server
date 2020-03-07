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
  isInMealTime(cafeteriaId, mealType/* 0 or 1 or 2 */) {
    throw new Error('Not implemented!');
  }

  userExists(userId) {
    throw new Error('Not implemented!');
  }

  isBarcodeActive(userId, activeDurationMinute/* in minutes */) {
    throw new Error('Not implemented!');
  }

  isFirstToday(userId) {
    throw new Error('Not implemented!');
  }

  barcodeNotUsedRecently(userId, intervalSec) {
    throw new Error('Not implemented!');
  }

  isTokenValid(cafeteriaId, plainToken) {
    throw new Error('Not implemented!');
  }
}

export default DiscountTransactionValidator;