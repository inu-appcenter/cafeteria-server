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
import CafeteriaDiscountRule from '../../domain/entities/CafeteriaDiscountRule';
import DiscountTransaction from '../../domain/entities/DiscountTransaction';
import UserDiscountStatus from '../../domain/entities/UserDiscountStatus';

import logger from '../../common/utils/logger';
import dateUtil from '../../common/utils/dateUtil';

import seq from 'sequelize';
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

    this.userDiscountStatusModel = this.db.model('user_discount_status');
    this.cafeteriaDiscountRuleModel = this.db.model('cafeteria_discount_rule');
    this.discountTransactionModel = this.db.model('discount_transaction');
  }

  async getUserDiscountStatusByUserId(userId) {
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

  async getCafeteriaDiscountRuleByCafeteriaId(cafeteriaId) {
    const seqModel = await this.cafeteriaDiscountRuleModel.findOne({
      where: {
        cafeteria_id: cafeteriaId,
      },
    });

    if (!seqModel) {
      return null;
    }

    return new CafeteriaDiscountRule({
      token: seqModel.token,
      availableMealTypes: seqModel.available_meal_types,

      cafeteriaId: seqModel.cafeteria_id,
    });
  }

  async getAllTransactionsOfUserToday(userId) {
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
      logger.warn('invalid userId');
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
      logger.warn('invalid userId');
      return false;
    }

    try {
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
      logger.warn('invalid transaction');
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
      logger.warn('invalid transaction');
      return false;
    }

    const {/* mealType, */userId, cafeteriaId} = transaction;

    if (!userId || !cafeteriaId) {
      logger.warn(`wrong transaction: ${transaction}`);
      return false;
    }

    try {
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
}

export default TransactionRepositoryImpl;
