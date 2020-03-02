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

const TAG = 'TransactionRepositoryImpl';

const logger = require('@common/logger');

const sequelize = require('@infrastructure/database/sequelize');

const UserDiscountStatus = require('@domain/entities/UserDiscountStatus');
const CafeteriaDiscountRule = require('@domain/entities/CafeteriaDiscountRule');
const DiscountTransaction = require('@domain/entities/CafeteriaDiscountRule');

require('@common/Date'); /* Date prototype */

module.exports = class {
  constructor() {
    this.db = sequelize;

    this.userDiscountStatusModel = this.db.model('user_discount_status');
    this.cafeteriaDiscountRuleModel = this.db.model('cafeteria_discount_rule');
    this.discountTransactionModel = this.db.model('discount_transaction');
  }

  async getUserDiscountStatusByUserId(userId) {
    const seqModels = await this.userDiscountStatusModel.findOne({
      where: {
        user_id: userId,
      },
    });

    return seqModels.map((seqModel) => {
      return new UserDiscountStatus({
        lastBarcodeActivation: seqModel.last_barcode_activation,
        lastBarcodeTagging: seqModel.last_barcode_tagging,

        userId: seqModel.user_id,
      });
    });
  }

  async getCafeteriaDiscountRuleByCafeteriaId(cafeteriaId) {
    const seqModels = await this.cafeteriaDiscountRuleModel.findOne({
      where: {
        cafeteria_id: cafeteriaId,
      },
    });

    return seqModels.map((seqModel) => {
      return new CafeteriaDiscountRule({
        token: seqModel.token,
        availableMealTypes: seqModel.available_meal_types,

        cafeteriaId: seqModel.cafeteria_id,
      });
    });
  }

  async getAllTransactionsOfUserToday(userId) {
    const seqModels = await this.discountTransactionModel.findAll({
      where: sequelize.and(
          {user_id: userId},
          sequelize.where(
              sequelize.cast('timestamp', 'DATE'), /* cast timestamp as date */
              new Date().yyyymmdd(), /* and compare that with yyyymmdd string */
          ),
      ),
    });

    return seqModels.map((seqModel) => {
      return new DiscountTransaction({
        mealType: seqModel.meal_type,

        userId: seqModel.user_id,
        cafeteriaId: seqModel.cafeteria_id,
      });
    });
  }

  async tryActivateBarcode(userId) {
    const result = await this.userDiscountStatusModel.upsert(
        {id: userId, last_barcode_activation: sequelize.fn('NOW')},
    );

    return result;
  }

  async tryWriteDiscountTransaction(transaction) {
    if (!transaction) {
      logger.warn('tryWriteDiscountTransaction: invalid transaction', TAG);
      return false;
    }

    const {mealType, userId, cafeteriaId} = transaction;

    try {
      await this.discountTransactionModel.insert({
        /* id will get autoincrease */

        meal_type: mealType,
        user_id: userId,
        cafeteria_id: cafeteriaId,

        timestamp: sequelize.fn('NOW'),
      });

      return true;
    } catch (e) {
      logger.error(`tryWriteDiscountTransaction: ${e}`, TAG);

      return false;
    }
  }

  async tryRemoveDiscountTransaction(transaction) {
    if (!transaction) {
      logger.warn('tryRemoveDiscountTransaction: invalid transaction', TAG);
      return false;
    }

    const {/* mealType, */userId, cafeteriaId} = transaction;

    try {
      await this.discountTransactionModel.destroy({
        where: sequelize.and(
            {
            /**
             * Combintation of these two fileds works as
             * a candidate key of a transaction
             * (without knowing the primary key).
             */
              user_id: userId,
              cafeteria_id: cafeteriaId,
            },

            /**
           * This is important.
           * We need to delete transaction only for today.
           */
            sequelize.where(
                /* cast timestamp as date */
                sequelize.cast('timestamp', 'DATE'),
                /* and compare that with yyyymmdd string */
                new Date().yyyymmdd(),
            ),
        ),
      });

      return true;
    } catch (e) {
      logger.error(`tryRemoveDiscountTransaction: ${e}`, TAG);

      return false;
    }
  }
};
