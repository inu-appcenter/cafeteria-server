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

import UseCase from '../../common/base/UseCase';
import {Menu} from '@inu-cafeteria/backend-core';
import MenuRepository from './MenuRepository';

export type GetMenusParams = {
  cornerId?: number;
  date: string; // YYYYMMDD
};

class GetMenus extends UseCase<GetMenusParams, Menu[]> {
  async onExecute({cornerId, date}: GetMenusParams): Promise<Menu[]> {
    if (cornerId) {
      return MenuRepository.getMenusByCornerId(cornerId, date);
    } else {
      return MenuRepository.getAllMenus(date);
    }
  }
}

export default new GetMenus();
