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
 * Do check if this user is able to get a discount.
 * It checks these conditions:
 * - In a proper meal time?
 * - Barcode recently activated?
 * - Has already received a discount on that day?
 * - Isn't it too frequent? (15 sec interval)
 *
 * Possible failure cases:
 * - Not a meal type -> 200, { "message": "SUCCESS", "activated": "0" }
 * - Error in DB while finding a barcode -> 500, { "message": "DB_QUERY_ERROR" }
 * - No barcode found -> 400, { "message": "BARCODE_ERROR" }
 * - Barcode not activated -> 200, { "message : "SUCCESS", "activated": "0" }
 * - DB error while looking for discount history -> 200, { "message" : "DB_ERROR" }
 * - Discount already applied -> 200, { "message": "SUCCESS", "activated": "0" }
 * - Too frequent attempt -> 200, { "message": "SUCCESS", "activated": "0" }
 *
 * On success case:
 * -> 200, { "message": "SUCCESS", "activated": "1" }
 */

import UseCase from './UseCase';

/**
 * Check if this discount is valid so can be allowed.
 */
class ValidateDiscountTransaction extends UseCase {
  constructor({transactionService}) {
    super();

    this.transactionService = transactionService;
  }

  async onExecute({transaction, transactionToken}) {
    return this.transactionService.validateDiscountTransaction({transaction, transactionToken});
  }
}

export default ValidateDiscountTransaction;
