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
import DiscountValidationResults from '../entities/DiscountValidationResults';
import logger from '../../common/utils/logger';

/**
 * Check if this discount is valid so can be allowed.
 */
class ValidateDiscountTransaction extends UseCase {
  constructor({transactionValidator}) {
    super();
    this.transactionValidator = transactionValidator;
  }

  async onExecute({transaction, token}) {
    // Extract params.
    const {userId, cafeteriaId, mealType} = transaction;

    const isInMealTime = await this.transactionValidator
        .isInMealTime(cafeteriaId, mealType);
    if (!isInMealTime) {
      logger.verbose(`${userId} validating: is not in meal time :(`);

      return DiscountValidationResults.USUAL_FAIL;
    }

    logger.verbose(`${userId} validating: is in meal time :)`);

    const userExists = await this.transactionValidator
        .userExists(userId);
    if (!userExists) {
      logger.verbose(`${userId} validating: user does not exist :(`);

      return DiscountValidationResults.UNUSUAL_NO_BARCODE; /* no barcode = no user */
    }

    logger.verbose(`${userId} validating: user exists :)`);

    const barcodeIsActive = await this.transactionValidator
        .isBarcodeActive(userId, 10/* available for 10 mins */);
    if (!barcodeIsActive) {
      logger.verbose(`${userId} validating: barcode is not active :(`);

      return DiscountValidationResults.USUAL_FAIL;
    }

    logger.verbose(`${userId} validating: barcode is active :)`);

    const isFirstToday = await this.transactionValidator
        .isFirstToday(userId);
    if (!isFirstToday) {
      logger.verbose(`${userId} validating: is not first today :(`);

      return DiscountValidationResults.USUAL_FAIL;
    }

    logger.verbose(`${userId} validating: is first today :)`);

    const isNotFrequent = await this.transactionValidator
        .barcodeNotUsedRecently(userId, 15/* interval 15 secs */);
    if (!isNotFrequent) {
      logger.verbose(`${userId} validating: is too frequent :(`);

      return DiscountValidationResults.USUAL_FAIL;
    }

    logger.verbose(`${userId} validating: is not frequent :)`);

    const tokenIsValid = await this.transactionValidator
        .isTokenValid(cafeteriaId, token);
    if (!tokenIsValid) {
      logger.verbose(`${userId} validating: cafeteria token is invalid :(`);

      return DiscountValidationResults.UNUSUAL_WRONG_PARAM;
    }

    logger.verbose(`${userId} validating: cafeteria token is valid :)`);

    logger.verbose(`${userId} validating: SUCCEEDED`);

    return DiscountValidationResults.USUAL_SUCCESS;
  }
}

export default ValidateDiscountTransaction;
