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

import WaitingOrderRepository from '../../domain/repositories/WaitingOrderRepository.mjs';
import WaitingOrder from '../../domain/entities/WaitingOrder.mjs';
import moment from 'moment';
import logger from '../../common/utils/logger.mjs';
import WaitingOrderMutationResult from '../../domain/constants/WaitingOrderMutationResult.mjs';
import Sequelize from 'sequelize';
import config from '../../../config.mjs';

class WaitingOrderRepositoryImpl extends WaitingOrderRepository {
  constructor({db}) {
    super();

    this.db = db;
    this.orderModel = this.db.model('waiting_order');
  }

  async getWaitingOrder(orderId) {
    if (!orderId) {
      return null;
    }

    const seqOrder = await this.orderModel.findByPk(orderId, {
      where: {
        createdAt: this._getFreshWhereClause(),
      },
    });

    if (!seqOrder) {
      return null;
    }

    return this._seqOrderToOrder(seqOrder);
  }

  async getWaitingOrderByNumberAndCafeteriaId(number, cafeteriaId) {
    if (!number || !cafeteriaId) {
      return null;
    }

    const seqOrder = await this.orderModel.findOne({
      where: {
        number: number,
        cafeteria_id: cafeteriaId,
        createdAt: this._getFreshWhereClause(), /** Order created in 24h */
      },
    });

    if (!seqOrder) {
      return null;
    }

    return this._seqOrderToOrder(seqOrder);
  }

  async getWaitingOrdersByDeviceIdentifier(deviceIdentifier) {
    if (!deviceIdentifier) {
      return [];
    }

    const seqOrders = await this.orderModel.findAll({
      where: {
        device_identifier: deviceIdentifier,
        createdAt: this._getFreshWhereClause(), /** Order created in [config] time */
      },
    });

    return seqOrders.map((seqOrder) => this._seqOrderToOrder(seqOrder));
  }

  _seqOrderToOrder(seqOrder) {
    return new WaitingOrder({
      id: seqOrder.id,
      done: seqOrder.done,
      number: seqOrder.number,
      cafeteriaId: seqOrder.cafeteria_id,
      deviceIdentifier: seqOrder.device_identifier,
    });
  }

  _getFreshWhereClause() {
    return {
      [Sequelize.Op.gte]: moment().subtract(config.waiting.orderTTL.amount, config.waiting.orderTTL.unit).toDate(),
    };
  }

  async addWaitingOrder(order) {
    if (!order) {
      return WaitingOrderMutationResult.WRONG_PARAM;
    }

    if (!order.number) {
      return WaitingOrderMutationResult.WRONG_PARAM;
    }

    if (!order.cafeteriaId) {
      return WaitingOrderMutationResult.WRONG_PARAM;
    }

    if (!order.deviceIdentifier) {
      return WaitingOrderMutationResult.WRONG_PARAM;
    }

    try {
      // eslint-disable-next-line no-unused-vars
      const [instance, created] = await this.orderModel.findOrCreate({
        where: {
          number: order.number,
          cafeteria_id: order.cafeteriaId,
        },
        defaults: {
          done: false,
          number: order.number,
          cafeteria_id: order.cafeteriaId,
          device_identifier: order.deviceIdentifier,
        },
      });

      if (created) {
        return WaitingOrderMutationResult.OK;
      } else {
        return WaitingOrderMutationResult.ORDER_ALREADY_REGISTERED;
      }
    } catch (e) {
      logger.error(e);

      return WaitingOrderMutationResult.ERROR;
    }
  }

  async deleteWaitingOrder(orderId) {
    try {
      const deleted = await this.orderModel.destroy({
        where: {
          id: orderId,
        },
      });

      if (deleted) {
        return WaitingOrderMutationResult.OK;
      } else {
        return WaitingOrderMutationResult.ORDER_NOT_EXIST;
      }
    } catch (e) {
      return WaitingOrderMutationResult.ERROR;
    }
  }

  async markOrderDone(orderId) {
    try {
      const updated = await this.orderModel.update(
        {done: true},
        {where: {id: orderId}},
      );

      if (updated) {
        return WaitingOrderMutationResult.OK;
      } else {
        return WaitingOrderMutationResult.ORDER_NOT_EXIST;
      }
    } catch (e) {
      return WaitingOrderMutationResult.ERROR;
    }
  }

  async purgeOldWaitingOrders() {
    const count = await this.orderModel.destroy({
      where: {
        createdAt: this._getOldWhereClause(), /** Order aged over 24h */
      },
    });

    logger.info(`Purged ${count} outdated waiting orders: which have been here for over ${config.waiting.orderTTL.amount} ${config.waiting.orderTTL.unit}(s).`);

    return count;
  }

  _getOldWhereClause() {
    return {
      [Sequelize.Op.lt]: moment().subtract(config.waiting.orderTTL.amount, config.waiting.orderTTL.unit).toDate(),
    };
  }
}

export default WaitingOrderRepositoryImpl;
