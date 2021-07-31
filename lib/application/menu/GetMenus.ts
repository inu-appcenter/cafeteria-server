/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2021 INU Global App Center <potados99@gmail.com>
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
import moment from 'moment';

export type GetMenusParams = {
  /**
   * 식단을 가져올 코너의 id.
   * 없으면 전체 다 가져와요.
   */
  cornerId?: number;

  /**
   * 가져올 식단의 날짜.
   * YYYYMMDD 형식 스트링입니다.
   * 없으면 오늘로 정해져요.
   */
  date?: string;

  /**
   * 위의 date에 추가적으로 날짜를 더하고 뺄 수 있습니다.
   * 예를 들어 '내일' 식단을 가져오고 싶으면, date을 비워놓고 dateOffset=1로 주면 됩니다.
   */
  dateOffset?: number;
};

class GetMenus extends UseCase<GetMenusParams, Menu[]> {
  async onExecute({cornerId, date, dateOffset}: GetMenusParams): Promise<Menu[]> {
    const dateString = this.formatActualDateString(date, dateOffset);

    if (cornerId) {
      return MenuRepository.getMenusByCornerId(cornerId, dateString);
    } else {
      return MenuRepository.getAllMenus(dateString);
    }
  }

  private formatActualDateString(date?: string, dateOffset?: number) {
    const specifiedDate = date ? moment(date, 'YYYYMMDD') : moment();
    const offsetAdded = specifiedDate.add(dateOffset, 'days');

    return offsetAdded.format('YYYYMMDD');
  }
}

export default new GetMenus();
