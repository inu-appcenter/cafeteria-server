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

const sequelize = require('@infrastructure/database/sequelize');
const { Op } = require('sequelize');

const DiscountTransactionTokenPair = require('@domain/entities/DiscountTransactionTokenPair');
const DiscountTransaction = require('@domain/entities/DiscountTransaction');

require('@common/Date'); /* Date prototype */

module.exports = class {

	constructor() {
		this.db = sequelize;

		this.cafeteriaModel = this.db.model('cafeteria');
		this.discountTransactionModel = this.db.model('discount_transaction');
	}

	async getDiscountTransactionTokenPairs() {
		const seqAllCafeteriaAllowingDiscounts = await this.cafeteriaModel.findAll({
			where: {
				allow_discount: true
			 }
		});

		return seqAllCafeteriaAllowingDiscounts.map((seqCafeteria) => {
			return new TransactionTokenPair({
				token: seqCafeteria.discount_token, /* should not be null here. */
				cafeteriaId: seqCafeteria.id
			});
		});
	}

	async saveDiscountTransaction(transaction) {
		const result = await this.discountTransactionModel.insert({
			id: transaction.id,
			token: transaction.token,
			meal_type: transaction.mealType,
			transaction_type: transaction.transactionType,
			user_id: transaction.userId,
			cafeteria_id: transaction.cafeteriaId
		});

		return (!!result);
	}

	async getDiscountTransactionsOfUserIdToday(userId) {
		const result = await this.discountTransactionModel.findAll({
			where: sequelize.and(
				{ user_id: userId },
				sequelize.where(
					sequelize.cast('timestamp', 'DATE'), /* cast timestamp as date */
					new Date().extractDate() /* and compare that with yyyymmdd string */
				)
			)
		});

		return result.map((seqTransaction) => {
			return new DiscountTransaction({
				id: seqTransaction.id,
				toke: seqTransaction.token,
				mealType: seqTransaction.meal_type,
				transactionType: seqTransaction.transaction_type,
				userId: seqTransaction.user_id,
				cafeteriaId: seqTransaction.cafeteria_id
			});
		});
	}

};
