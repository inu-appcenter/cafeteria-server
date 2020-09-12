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

// eslint-disable-next-line no-unused-vars
import Object from '../../common/extensions/Object';
import BaseConverter from './BaseConverter';
import cheerio from 'cheerio';
import Menu from '../../domain/entities/Menu';

const expressionStrings = [
  '(?<PRICE>[0-9,]+)원[\n ](?<CAL>[0-9]+)[Kk]cal',
  '(?<PRICE>[0-9,]+)원[\n ](?<CAL>[0-9]+)[Kk]cal[\n ](?<CAL2>[0-9]+)[Kk]cal',
  '(?<PRICE>[0-9,]+)원/(?<PRICE2>[0-9,]+)원[\n ](?<CAL>[0-9]+)[Kk]cal/(?<CAL2>[0-9]+)[Kk]cal',
];

class DirectMenuConverter extends BaseConverter {
  onConvert({rawHtml, cafeteria, corners}) {
    const menus = [];

    const toDoWithCafeteriaAndCornerNames = (thisCafeteria, thisCorner) => {
      const {foods, price, calorie} = this._getMenuByCafeteriaAndCornerName(
        rawHtml,
        thisCafeteria.name,
        thisCorner.name,
      );

      const menu = new Menu({
        foods,
        price,
        calorie,
        cornerId: thisCorner.id,
      });

      menus.push(menu);
    };

    this._forEachCafeteriaAndCorners(cafeteria, corners, toDoWithCafeteriaAndCornerNames);

    console.log(menus);
  }

  _forEachCafeteriaAndCorners(cafeteria, corners, action) {
    for (const thisCafeteria of cafeteria) {
      const cornersOfThisCafeteria = corners.filter((corner) => corner.cafeteriaId === thisCafeteria.id);
      for (const thisCorner of cornersOfThisCafeteria) {
        action(thisCafeteria, thisCorner);
      }
    }
  }

  _getMenuByCafeteriaAndCornerName(rawHtml, cafeteriaName, cornerName) {
    const rawMenuText = this._extractRawMenuTextFromHtmlByCafeteriaAndCornerName(rawHtml, cafeteriaName, cornerName);

    return this._extractFoodMenuAndMetadataFromRawMenuText(rawMenuText, expressionStrings);
  }

  _extractRawMenuTextFromHtmlByCafeteriaAndCornerName(rawHtml, cafeteriaName, cornerName) {
    const $ = cheerio.load(rawHtml);

    const $cornerNameTd = $(`table > tbody:Contains(\"${cafeteriaName}\") > tr > td:Contains(\"${cornerName}\")`);
    const $cornerMenuTd = $cornerNameTd.closest('tr').next().children().eq($cornerNameTd.index());

    return $cornerMenuTd.text();
  }

  _extractFoodMenuAndMetadataFromRawMenuText(rawMenuText, priceAndCalorieRegexStrings) {
    const longestMatchedResult = this._matchUsingMostWideScopeExpression(rawMenuText, priceAndCalorieRegexStrings);
    const metadataPart = longestMatchedResult?.[0];
    const menuPart = rawMenuText.replace(metadataPart, '');

    return {
      foods: menuPart
        .trim()
        .split('\n')
        .filter((food) => food.length > 0),
      price: longestMatchedResult?.groups?.PRICE,
      calorie: longestMatchedResult?.groups?.CAL,
    };
  }

  _matchUsingMostWideScopeExpression(text, regexStrings) {
    return regexStrings
      .map((exprString) => new RegExp(exprString))
      .map((expr) => expr.exec(text))
      .filter((result) => !!result)
      .takeIf((collection) => collection.length > 0)
      ?.reduce((prev, current) => this._selectExecResultWithLongerMatchedPart(prev, current));
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
}

export default DirectMenuConverter;
