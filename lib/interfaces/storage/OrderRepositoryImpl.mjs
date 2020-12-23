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

import OrderRepository from '../../domain/repositories/OrderRepository.mjs';
import Order from '../../domain/entities/Order.mjs';
import moment from 'moment';
import {Op} from 'sequelize';

class OrderRepositoryImpl extends OrderRepository {
  constructor({db}) {
    super();

    this.db = db;
    this.orderModel = this.db.model('order');
  }

  async getOrderByNumberAndCafeteriaId(number, cafeteriaId) {
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

  async getOrdersByDeviceIdentifier(deviceIdentifier) {
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
    return new Order({
      id: seqOrder.id,
      number: seqOrder.number,
      cafeteriaId: seqOrder.cafeteria_id,
      deviceIdentifier: seqOrder.device_identifier,
    });
  }

  _getPast24hWhereClause() {
    return {
      [Op.gte]: moment().subtract(24, 'hours').toDate(), // After (today-1). Past 1 day.
    };
  }

  async addOrder(order) {
    if (!order) {
      return 0;
    }

    if (!order.number) {
      return 0;
    }

    if (!order.cafeteriaId) {
      return 0;
    }

    if (!order.deviceIdentifier) {
      return 0;
    }

    return await this.orderModel.upsert({
      number: order.number,
      cafeteria_id: order.cafeteriaId,
      device_identifier: order.deviceIdentifier,
    });
  }
}

export default OrderRepositoryImpl;
