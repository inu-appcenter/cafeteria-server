/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020 INU Appcenter <potados99@gmail.com>
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
'use strict';

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

const returnCodes = {
	USUAL_SUCCESS: 0,
	USUAL_FAIL: 1,

	UNUSUAL_NO_BARCODE: 2,
	UNUSUAL_WRONG_PARAM: 3
};

module.exports = async ({ transaction/* technically a transaction request */, token }, { validator }) => {

	 const { userId, cafeteriaId, mealType } = transaction;

	const isInMealTime = await validator.isInMealTime(cafeteriaId, mealType);
	if (!isInMealTime) {
		return returnCodes.USUAL_FAIL;
	}

	const userExists = await validator.userExists(userId);
	if (!userExists) {
		return returnCodes.UNUSUAL_NO_BARCODE; /* no barcode = no user */
	}

	const barcodeIsActive = await validator.isBarcodeActive(userId);
	if (!barcodeIsActive) {
		return returnCodes.USUAL_FAIL;
	}

	const isFirstToday = await validator.isFirstToday(userId);
	if (!isFirstToday) {
		return returnCodes.USUAL_FAIL;
	}

	const isNotFrequent = await validator.barcodeNotUsedRecently(userId);
	if (!isNotFrequent) {
		return returnCodes.USUAL_FAIL;
	}

	const tokenIsValid = await validator.isTokenValid(cafeteriaId, token);
	if (!tokenIsValid) {
		return returnCodes.UNUSUAL_WRONG_PARAM;
	}

	return USUAL_SUCCESS;
};

module.exports.returnCodes = returnCodes;
