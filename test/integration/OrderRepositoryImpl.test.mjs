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

import OrderRepositoryImpl from '../../lib/interfaces/storage/OrderRepositoryImpl.mjs';
import {createSequelizeInstance} from '../../lib/infrastructure/database/configurations/sequelizeHelper.mjs';
import initial from '../../actions/db/initial-db-contents.mjs';
import sequelize from '../../lib/infrastructure/database/sequelize.mjs';

beforeAll(async () => {
  await setupOrderRecordsInDb();
});

describe('# Get orders by fcm token', () => {
  function getRepository() {
    const sequelize = createSequelizeInstance({mock: false});

    return new OrderRepositoryImpl({db: sequelize});
  }

  it('should fetch current(24h) order with fcm token', async () => {
    const repo = getRepository();

    const orders = await repo.getOrdersByFcmToken('potados');

    expect(orders.length).toBe(1);
  });

  it('should fetch current(24h) order with fcm token (2)', async () => {
    const repo = getRepository();

    const orders = await repo.getOrdersByFcmToken('mooo');

    expect(orders.length).toBe(2);
  });
});

async function setupOrderRecordsInDb() {
  await sequelize.sync();
  const orderModel = sequelize.model('order');

  await orderModel.destroy({where: {}});
  await orderModel.bulkCreate(initial.orders, {
    updateOnDuplicate: Object.keys(orderModel.rawAttributes),
  });
}
