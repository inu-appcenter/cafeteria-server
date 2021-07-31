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

import logger from '../../../../common/logging/logger';
import Matcher, {RegexResult} from './helper/Matcher';

export default class MenuTokenizer {
  splitFoodsAndMetadata(rawMenuText: string, metadataExpressions: string[] = []) {
    logger.verbose(
      `<메뉴 파싱 stage 2> 가져온 메뉴 스트링을 분석하여 식단과 가격, 열량을 분리합니다.`
    );

    const longestMatchedResult = new Matcher(rawMenuText, metadataExpressions).longestMatch();
    const metadataPart = longestMatchedResult ? longestMatchedResult[0] : '';
    const menuPart = rawMenuText.replace(metadataPart, '');

    return {
      foods: this.tokenizeFoodsPart(menuPart),
      price: this.getNumberPropertySafely(longestMatchedResult, 'PRICE'),
      calorie: this.getNumberPropertySafely(longestMatchedResult, 'CAL'),
    };
  }

  private tokenizeFoodsPart(menuPart: string) {
    return menuPart
      .trim()
      .split('\n')
      .map((food) => food.trim())
      .filter((food) => food.length > 0);
  }

  private getNumberPropertySafely(matchedResult: RegexResult, propName: string) {
    const valueString = matchedResult?.groups?.[propName];
    if (valueString == null) {
      return null;
    }

    const withoutComma = valueString.replace(',', '');

    return Number.parseInt(withoutComma);
  }
}
