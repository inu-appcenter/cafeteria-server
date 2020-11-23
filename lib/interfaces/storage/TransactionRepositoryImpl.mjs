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

import TransactionRepository from '../../domain/repositories/TransactionRepository';
import CafeteriaValidationParams from '../../domain/entities/CafeteriaValidationParams';
import DiscountTransaction from '../../domain/entities/DiscountTransaction';
import UserDiscountStatus from '../../domain/entities/UserDiscountStatus';

import logger from '../../common/utils/logger';
import dateUtil from '../../common/utils/dateUtil';

import seq from 'sequelize';
import CafeteriaDiscountRule from '../../domain/entities/CafeteriaDiscountRule';
const {Sequelize} = seq; /* Sequelize.and */

/**
 * Implementation of TransactionRepository.
 */
class TransactionRepositoryImpl extends TransactionRepository {
  constructor({db}) {
    super();

    // It is too complicate to create an interface about DB.
    // Just import and use it directly.
    this.db = db;

    this.userModel = this.db.model('user');
    this.cafeteriaDiscountRuleModel = this.db.model('cafeteria_discount_rule');
    this.userDiscountStatusModel = this.db.model('user_discount_status');
    this.discountTransactionModel = this.db.model('discount_transaction');
    this.cafeteriaValidationParamsModel = this.db.model('cafeteria_validation_params');
    this.transactionHistoryModel = this.db.model('transaction_history');
  }

  async getDiscountRule(ruleId) {
    if (!ruleId) {
      return null;
    }

    const seqModel = await this.cafeteriaDiscountRuleModel.findByPk(ruleId);

    if (!seqModel) {
      return null;
    }

    return new CafeteriaDiscountRule({
      id: seqModel.id,
      name: seqModel.name,
      description: seqModel.description,
      enabled: seqModel.enabled,
    });
  }

  async getUserDiscountStatusByUserId(userId) {
    if (!userId) {
      return null;
    }

    const seqModel = await this.userDiscountStatusModel.findByPk(userId);

    if (!seqModel) {
      return null;
    }

    return new UserDiscountStatus({
      lastBarcodeActivation: seqModel.last_barcode_activation,
      lastBarcodeTagging: seqModel.last_barcode_tagging,

      userId: seqModel.user_id,
    });
  }

  async getCafeteriaValidationParamsByCafeteriaId(cafeteriaId) {
    if (!cafeteriaId) {
      return null;
    }

    const seqModel = await this.cafeteriaValidationParamsModel.findOne({
      where: {
        cafeteria_id: cafeteriaId,
      },
    });

    if (!seqModel) {
      return null;
    }

    return new CafeteriaValidationParams({
      token: seqModel.token,
      availableMealTypes: seqModel.available_meal_types,
      timeRanges: {
        breakfast: seqModel.time_range_breakfast,
        lunch: seqModel.time_range_lunch,
        dinner: seqModel.time_range_dinner,
      },

      cafeteriaId: seqModel.cafeteria_id,
    });
  }

  async getAllTransactionsOfUserToday(userId) {
    if (!userId) {
      return [];
    }

    const seqModels = await this.discountTransactionModel.findAll({
      where: Sequelize.and(
        {user_id: userId},
        Sequelize.where(
          Sequelize.literal('CAST(timestamp AS DATE)'), /* no quotes allowed in CAST function. */
          dateUtil.format(new Date(), true), /* and compare that with yyyy-mm-dd string */
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

  async activateBarcode(userId) {
    if (!userId) {
      logger.warn(`wrong userId: ${userId}`);
      return false;
    }

    try {
      await this.userDiscountStatusModel.upsert(
        {user_id: userId, last_barcode_activation: Sequelize.fn('NOW')},
      );

      return true;
    } catch (e) {
      logger.error(e);

      return false;
    }
  }

  async updateBarcodeTagTime(userId) {
    if (!userId) {
      logger.warn(`wrong userId: ${userId}`);
      return false;
    }

    try {
      // Perform updating last tag time whatever the user exists or not.
      await this.userDiscountStatusModel.upsert(
        {user_id: userId, last_barcode_tagging: Sequelize.fn('NOW')},
      );

      return true;
    } catch (e) {
      logger.error(e);

      return false;
    }
  }

  async writeDiscountTransaction(transaction) {
    if (!transaction) {
      logger.warn(`wrong transaction: ${transaction}`);
      return false;
    }

    const {mealType, userId, cafeteriaId} = transaction;

    if (!userId || !cafeteriaId) {
      logger.warn(`wrong transaction: ${transaction}`);
      return false;
    }

    try {
      await this.discountTransactionModel.create({
        /* id will get auto increase */

        meal_type: mealType,
        user_id: userId,
        cafeteria_id: cafeteriaId,

        timestamp: Sequelize.fn('NOW'),
      });

      return true;
    } catch (e) {
      logger.error(e);

      return false;
    }
  }

  async removeDiscountTransaction(transaction) {
    if (!transaction) {
      logger.warn(`wrong transaction: ${transaction}`);
      return false;
    }

    const {/* mealType, */userId, cafeteriaId} = transaction;

    if (!userId || !cafeteriaId) {
      logger.warn(`wrong transaction: ${transaction}`);
      return false;
    }

    try {
      // Remove only those of today!
      await this.discountTransactionModel.destroy({
        where: Sequelize.and(
          {user_id: userId, cafeteria_id: cafeteriaId},
          Sequelize.where(
            Sequelize.literal('CAST(timestamp AS DATE)'), /* no quotes allowed in CAST function. */
            dateUtil.format(new Date(), true), /* and compare that with yyyy-mm-dd string */
          ),
        ),
      });

      return true;
    } catch (e) {
      logger.error(e);

      return false;
    }
  }

  async leaveTransactionHistory(transactionHistory) {
    if (!transactionHistory) {
      logger.warn(`wrong transactionHistory: ${transactionHistory}`);
      return false;
    }

    logger.info(`Leaving transaction history...`);

    try {
      await this.transactionHistoryModel.upsert(
        {
          type: transactionHistory.type,
          user_id: transactionHistory.userId,
          cafeteria_id: transactionHistory.cafeteriaId,
          meal_type: transactionHistory.mealType,
          failed_at: transactionHistory.failedAt,
          message: transactionHistory.message,

          timestamp: Sequelize.fn('NOW'),
        },
      );

      return true;
    } catch (e) {
      logger.error(e);

      return false;
    }
  }
}

export default TransactionRepositoryImpl;
