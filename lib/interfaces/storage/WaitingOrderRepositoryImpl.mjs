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

class WaitingOrderRepositoryImpl extends WaitingOrderRepository {
  constructor({db}) {
    super();

    this.db = db;
    this.orderModel = this.db.model('waiting_order');
  }

  async getWaitingOrderByNumberAndCafeteriaId(number, cafeteriaId) {
    if (!number || !cafeteriaId) {
      return null;
    }

    const seqOrder = await this.orderModel.findOne({
      where: {
        number: number,
        cafeteria_id: cafeteriaId,
        createdAt: this._getPast24hWhereClause(), /** Order created in 24h */
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
        createdAt: this._getPast24hWhereClause(), /** Order created in 24h */
      },
    });

    return seqOrders.map((seqOrder) => this._seqOrderToOrder(seqOrder));
  }

  _seqOrderToOrder(seqOrder) {
    return new WaitingOrder({
      id: seqOrder.id,
      number: seqOrder.number,
      cafeteriaId: seqOrder.cafeteria_id,
      deviceIdentifier: seqOrder.device_identifier,
    });
  }

  _getPast24hWhereClause() {
    return {
      [Sequelize.Op.gte]: moment().subtract(24, 'hours').toDate(), // After (today-1). Past 1 day.
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

    const alreadyExistingOrderWithSameContent = await this.getWaitingOrderByNumberAndCafeteriaId(
      order.number,
      order.cafeteriaId,
    );

    if (alreadyExistingOrderWithSameContent) {
      // An order can be registered only for ONCE.
      return WaitingOrderMutationResult.ORDER_ALREADY_REGISTERED;
    }

    try {
      await this.orderModel.create({
        number: order.number,
        cafeteria_id: order.cafeteriaId,
        device_identifier: order.deviceIdentifier,
      });

      return WaitingOrderMutationResult.OK;
    } catch (e) {
      logger.error(e);

      return WaitingOrderMutationResult.ERROR;
    }
  }

  async deleteWaitingOrder(orderId, deviceIdentifier) {
    try {
      const deleted = await this.orderModel.destroy({
        where: {
          id: orderId,
          device_identifier: deviceIdentifier,
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
}

export default WaitingOrderRepositoryImpl;
