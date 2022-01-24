/**
 * This file is part of INU Cafeteria.
 *
 * Copyright 2021 INU Global App Center <potados99@gmail.com>
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

import {logger} from '@inu-cafeteria/backend-core';
import Extractor from './helper/Extractor';

export default class MenuTokenizer {
  tokenize(rawMenuText: string) {
    logger.verbose(
      `<메뉴 파싱 stage 2> 가져온 메뉴 스트링을 분석하여 식단과 가격, 열량, 추가 정보를 분리합니다.`
    );

    const extractor = new Extractor(rawMenuText);

    return {
      foods: extractor.extractFoods(),
      price: extractor.extractPrice(),
      calorie: extractor.extractCalorie(),
      extras: extractor.extractExtras(),
    };
  }
}
