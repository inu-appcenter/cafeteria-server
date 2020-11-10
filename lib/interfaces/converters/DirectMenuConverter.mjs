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

import BaseConverter from './BaseConverter';
import Menu from '../../domain/entities/Menu';
import config from '../../../config';
import cheerio from 'cheerio';

class DirectMenuConverter extends BaseConverter {
  onConvert({rawHtml, cafeteria, corners}) {
    const menus = [];

    const toDoWithCafeteriaAndCornerNames = (thisCafeteria, thisCorner) => {
      menus.push(
        ...this
        ._getMenusByCafeteriaAndCornerName(rawHtml, thisCafeteria.name, thisCorner.name)
        .map(({foods, price, calorie}) => new Menu({foods, price, calorie, cornerId: thisCorner.id}))
        .filter(({foods}) => foods.length > 0),
      );
    };

    this._forEachCafeteriaAndCorners(cafeteria, corners, toDoWithCafeteriaAndCornerNames);

    return menus;
  }

  _forEachCafeteriaAndCorners(cafeteria, corners, action) {
    for (const thisCafeteria of cafeteria) {
      const cornersOfThisCafeteria = corners.filter((corner) => corner.cafeteriaId === thisCafeteria.id);
      for (const thisCorner of cornersOfThisCafeteria) {
        action(thisCafeteria, thisCorner);
      }
    }
  }

  _getMenusByCafeteriaAndCornerName(rawHtml, cafeteriaName, cornerName) {
    const rawMenuTextsCombined = this._extractRawMenuTextsFromHtmlByCafeteriaAndCornerName(rawHtml, cafeteriaName, cornerName);

    return rawMenuTextsCombined
      .split(new RegExp(config.menu.parser.menuSplitterRegex))
      .map((rawMenuText) => this._extractFoodMenuAndMetadataFromRawMenuText(rawMenuText, config.menu.parser.priceAndCalorieRegex));
  }

  _extractRawMenuTextsFromHtmlByCafeteriaAndCornerName(rawHtml, cafeteriaName, cornerName) {
    const $ = cheerio.load(rawHtml);

    const $cornerNameTd = $(`table > tbody:Contains(\"${cafeteriaName}\") > tr > td:Contains(\"${cornerName}\")`);
    const $cornerMenuTds = $cornerNameTd.closest('tr').next().children();

    // Corner name and the contents are coupled by index.
    // Example:
    // |------------------------------|
    // | A lunch | A dinner | B lunch |
    // |------------------------------|
    // |  Menu1  |  Menu2   |  Menu3  |
    // |------------------------------|
    // 'A lunch' and 'Menu1' has index 0.
    // 'A dinner' and 'Menu2' has index 1.
    // 'B lunch' and 'Menu3' has index 2.
    // Same column index, different row.
    //
    // Corner name cells can share a single menu cell.
    // Multiple indices of the name cells should point the shared menu cell.
    // Example:
    // |------------------------------|
    // | A lunch | A dinner | B lunch |
    // |------------------------------|
    // |         No menu today        |
    // |------------------------------|
    // 'A lunch' has index 0. It is associated with index 0 of the row below.
    // 'A dinner' has index 1. But it has to be paired with index 0 of the under row.
    // 'B lunch' has index 2. It also has to be paired with index 0 of that row.

    const cornerNameIndex = $cornerNameTd.index();
    const cornerMenuLength = $cornerMenuTds.length;

    const $cornerMenuTd = $cornerMenuTds.eq(Math.min(cornerNameIndex, cornerMenuLength-1));

    return $cornerMenuTd.text();
  }

  _extractFoodMenuAndMetadataFromRawMenuText(rawMenuText, priceAndCalorieRegexStrings) {
    const longestMatchedResult = this._matchUsingMostWideScopeExpression(rawMenuText, priceAndCalorieRegexStrings);
    const metadataPart = longestMatchedResult ? longestMatchedResult[0] : undefined;
    const menuPart = rawMenuText.replace(metadataPart, '');

    return {
      foods: menuPart
        .trim()
        .split('\n')
        .filter((food) => food.length > 0)
        .map((food) => food.replace(' ', ''))
        .join(' '),
      price: this._getNumberPropertySafely(longestMatchedResult, 'PRICE'),
      calorie: this._getNumberPropertySafely(longestMatchedResult, 'CAL'),
    };
  }

  _matchUsingMostWideScopeExpression(text, regexStrings) {
    const results = regexStrings
      .map((exprString) => new RegExp(exprString))
      .map((expr) => expr.exec(text))
      .filter((result) => !!result);

    if (results.length > 0) {
      return results.reduce((prev, current) => this._selectExecResultWithLongerMatchedPart(prev, current));
    } else {
      return undefined;
    }
  }

  _selectExecResultWithLongerMatchedPart(one, another) {
    if (!one && !another) {
      return undefined;
    } else if (!one) {
      return another;
    } else if (!another) {
      return one;
    }

    return (one[0].length < another[0].length) ? another : one;
  }

  _getNumberPropertySafely(matchedResult, propName) {
    if (!matchedResult) {
      return null;
    }

    if (!matchedResult.groups[propName]) {
      return null;
    }

    return Number.parseInt(matchedResult.groups[propName].replace(',', ''));
  }
}

export default DirectMenuConverter;