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

import TransactionRepository from 'domain/repositories/TransactionRepository';
import DiscountTransaction from 'domain/entities/CafeteriaDiscountRule';
import UserDiscountStatus from 'domain/entities/UserDiscountStatus';

import sequelize from 'infrastructure/database/sequelize';
import {Sequelize} from 'sequelize';

import logger from 'common/logger';
import dateUtil from 'common/utils/date';

/**
 * Implementation of TransactionRepository.
 */
class TransactionRepositoryImpl extends TransactionRepository {
  constructor() {
    super();

    this.db = sequelize;

    this.userDiscountStatusModel = this.db.model('user_discount_status');
    this.cafeteriaDiscountRuleModel = this.db.model('cafeteria_discount_rule');
    this.discountTransactionModel = this.db.model('discount_transaction');
  }

  /**
   *
   * @param userId
   * @return {Promise<UserDiscountStatus|null>}
   */
  async getUserDiscountStatusByUserId(userId) {
    const seqModel = await this.userDiscountStatusModel.findOne({
      where: {
        user_id: userId,
      },
    });

    if (!seqModel) {
      return null;
    }

    return new UserDiscountStatus({
      lastBarcodeActivation: seqModel.last_barcode_activation,
      lastBarcodeTagging: seqModel.last_barcode_tagging,

      userId: seqModel.user_id,
    });
  }

  async getCafeteriaDiscountRuleByCafeteriaId(cafeteriaId) {
    const seqModels = await this.cafeteriaDiscountRuleModel.findOne({
      where: {
        cafeteria_id: cafeteriaId,
      },
    });

    return seqModels.map((seqModel) => {
      return new DiscountTransaction({
        token: seqModel.token,
        availableMealTypes: seqModel.available_meal_types,

        cafeteriaId: seqModel.cafeteria_id,
      });
    });
  }

  async getAllTransactionsOfUserToday(userId) {
    const seqModels = await this.discountTransactionModel.findAll({
      where: Sequelize.and(
          {user_id: userId},
          sequelize.where(
              sequelize.cast('timestamp', 'DATE'), /* cast timestamp as date */
              dateUtil.format(new Date()), /* and compare that with yyyymmdd string */
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

  tryActivateBarcode(userId) {
    return this.userDiscountStatusModel.upsert(
        {id: userId, last_barcode_activation: sequelize.fn('NOW')},
    );
  }

  async tryWriteDiscountTransaction(transaction) {
    if (!transaction) {
      logger.warn('invalid transaction');
      return false;
    }

    const {mealType, userId, cafeteriaId} = transaction;

    try {
      await this.discountTransactionModel.create({
        /* id will get auto increase */

        meal_type: mealType,
        user_id: userId,
        cafeteria_id: cafeteriaId,

        timestamp: sequelize.fn('NOW'),
      });

      return true;
    } catch (e) {
      logger.error(e);

      return false;
    }
  }

  async tryRemoveDiscountTransaction(transaction) {
    if (!transaction) {
      logger.warn('invalid transaction');
      return false;
    }

    const {/* mealType, */userId, cafeteriaId} = transaction;

    try {
      await this.discountTransactionModel.destroy({
        where: Sequelize.and(
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
                dateUtil.format(new Date()),
            ),
        ),
      });

      return true;
    } catch (e) {
      logger.error(e);

      return false;
    }
  }
}

export default TransactionRepositoryImpl;
