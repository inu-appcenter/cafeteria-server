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

module.exports = class {

	constructor(repo) {
		this.repo = repo;
	}

	async getUserDiscountStatusByUserId(userId) {
		return this.repo.getUserDiscountStatusByUserId(userId);
	}

	async getCafeteriaDiscountRuleByCafeteriaId(cafeteriaId) {
		return this.repo.getCafeteriaDiscountRuleByCafeteriaId(cafeteriaId);
	}

	async getAllTransactionsOfUserToday(userId) {
		return this.repo.getAllTransactionsOfUserToday(userId);
	}

	async tryActivateBarcode(userId) {
		return this.repo.tryActivateBarcode(userId);
	}

	async tryWriteDiscountTransaction(transaction) {
		return this.repo.tryWriteDiscountTransaction(transaction);
	}

	async tryRemoveDiscountTransaction(transaction) {
		return this.repo.tryRemoveDiscountTransaction(transaction);
	}

};
