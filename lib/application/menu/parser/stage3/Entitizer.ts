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

import {Menu} from '@inu-cafeteria/backend-core';
import {logger} from '@inu-cafeteria/backend-core';

type MenuProcessed = {
  foods: string[];
  price?: number;
  calorie?: number;
  extras: string[];
};

export default class Entitizer {
  toEntity(processed: MenuProcessed[], cornerId: number) {
    logger.verbose(`<메뉴 파싱 stage 3> 처리가 완료된 메뉴 데이터를 엔티티로 변환합니다.`);

    return processed
      .filter((m) => m.foods.length > 0)
      .map((m) =>
        Menu.create({
          foods: m.foods,
          price: m.price,
          calorie: m.calorie,
          extras: m.extras,

          cornerId: cornerId,
        })
      );
  }
}
