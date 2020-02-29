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


const returnCodes = {
	SUCCESS: 0,

	ALREADY_DISCOUNTED: 2,
	INTERNAL_ERROR: 3
};

module.exports = async (options, { transactionRepository, validator }) => {

	const transaction = options.transaction;
	const confirm = option.confirm; /* to confirm or cancel */

	if (confirm) {
		// Write it to DB.

		const firstToday = await validator.isFirstToday(transaction.userId);
		if (firstToday) {
			const writeResult = await transactionRepository.writeDiscountTransaction(transaction);
			if (writeResult) {
				return returnCodes.SUCCESS;
			} else {
				return returnCodes.INTERNAL_ERROR;
			}
		} else {
			return returnCodes.ALREADY_DISCOUNTED;
		}

	} else {
		// Cancel transaction, remove it from DB.

		const removeResult = await transactionRepository.removeDiscountTransaction(transaction);
		if (removeResult) {
			return returnCodes.SUCCESS;
		} else {
			return returnCodes.INTERNAL_ERROR;
		}

	}

};

module.exports.returnCodes = returnCodes;
