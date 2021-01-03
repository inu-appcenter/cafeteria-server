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

import UseCase from './UseCase.mjs';
import dateUtil from '../../common/utils/dateUtil.mjs';

/**
 * Launched every half hour.
 */
class EveryHalfHour extends UseCase {
  constructor({getMenus, purgeOldWaitingOrder}) {
    super();

    this.getMenus = getMenus;
    this.purgeOldWaitingOrder = purgeOldWaitingOrder;
  }

  async onExecute(param) {
    this.fetchMenusForFiveDaysAmount();
    this.removeAbandonedOrders();
  }

  fetchMenusForFiveDaysAmount() {
    const d = new Date();

    for (let i = 0; i < 5; i++) {
      this.getMenus.run({
        date: dateUtil.format(d),
      });

      d.setDate(d.getDate() + 1);
    }
  }

  removeAbandonedOrders() {
    this.purgeOldWaitingOrder.run();
  }
}

export default EveryHalfHour;
