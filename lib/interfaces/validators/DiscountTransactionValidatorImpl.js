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
 * This class is responsible for validating a discount transaction request.
 */
module.exports = class {

	constructor({ transactionRepository, userRepository }) {
		this.transactionRepository = transactionRepository;
		this.userRepository = transactionRepository;
	}

	isInMealTime(mealType/* 0 or 1 or 2 */) {
		return this.validator.isInMealTime(mealType);
	}

	userExists(userId) {
		return this.validator.userExists(userId);
	}

	isBarcodeActive(userId) {
		return this.validator.isBarcodeActive(userId);
	}

	isFirstToday(userId) {
		return this.validator.isFirstToday(userId);
	}

	barcodeNotUsedRecently(userId) {
		return this.validator.barcodeNotUsedRecently(userId);
	}

	isTokenValid(cafeteriaId, plainToken) {
		return this.validator.isTokenValid(cafeteriaId, plainToken);
	}

};
