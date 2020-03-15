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

import logger from '../../common/utils/logger';

import Menu from '../../domain/entities/Menu';
import BaseConverter from '../../domain/converter/BaseConverter';

class MenuConverter extends BaseConverter {
  constructor(cornerMenuKeys) {
    super();

    this._cafeteriaNumStart = 1;
    this._cornerMenuKeys = cornerMenuKeys;

    this._rawObject = null;

    this._menus = null;
  }

  convert(rawObject) {
    this._init(rawObject);

    return this._parseAllMenusAndGroupThemWithCornerId();
  }

  _init(rawObject) {
    this._rawObject = rawObject;
    this._menus = [];
  }

  _parseAllMenusAndGroupThemWithCornerId() {
    if (!this._assertParams()) {
      logger.warn('both rawObject and cornerMenuKeys must be valid');
      return null;
    }

    for (let cafeteriaNum = this._cafeteriaNumStart;
         this._rawCafeteriaExists(cafeteriaNum);
         cafeteriaNum++) {
      this._parseCorners(this._getRawCafeteria(cafeteriaNum));
    }

    return this._menus;
  }

  _assertParams() {
    return this._rawObject && this._cornerMenuKeys;
  }

  _rawCafeteriaExists(cafeteriaNum) {
    return !!this._getRawCafeteria(cafeteriaNum);
  }

  _getRawCafeteria(cafeteriaNum) {
    return this._rawObject[this._getCafeteriaFieldName(cafeteriaNum)];
  }

  _getCafeteriaFieldName(cafeteriaNum) {
    return 'foodMenuType' + cafeteriaNum + 'Result';
  }

  _parseCorners(rawCafeteria) {
    rawCafeteria.forEach((rawCorner) => {
      const matchedCornerMenuKey = this._findMatchingCornerMenuKey(rawCorner);

      if (matchedCornerMenuKey && rawCorner.MENU) {
        this._parseMenus(rawCorner.MENU, matchedCornerMenuKey.id);
      }
    });
  }

  _findMatchingCornerMenuKey(rawCorner) {
    return this._cornerMenuKeys.find((corner) =>
      corner.TYPE1 === parseInt(rawCorner.TYPE1) &&
      corner.TYPE2 === parseInt(rawCorner.TYPE2) &&
      corner.FOODMENU_TYPE === parseInt(rawCorner.FOODMENU_TYPE),
    );
  }

  _parseMenus(rawMenus, cornerId) {
    const parsedMenus = new RawMenuParser().parseMenus(rawMenus);

    parsedMenus.forEach((menu) => {
      this._menus.push(new Menu({
        foods: menu.foods,
        price: menu.price,
        calorie: menu.calorie,

        cornerId: cornerId,
      }));
    });
  }
}

class RawMenuParser {
  constructor() {
    this._rawMenuString = null;
    this._preprocessed = null;
    this._inProcess = null;

    this._extractedMenus = null;
  }

  parseMenus(rawMenus) {
    this._init(rawMenus);

    return this._parseAndExtractMenusFromDirtyRawString();
  }

  _init(rawMenuString) {
    this._rawMenuString = rawMenuString;
    this._preprocessed = '';
    this._inProcess = '';

    this._extractedMenus = [];
  }

  _parseAndExtractMenusFromDirtyRawString() {
    if (!this._assertParams()) {
      logger.warn('rawMenuString must be valid');
      return null;
    }

    this._preprocessMenuString();
    this._processMenuString();

    return this._extractedMenus;
  }

  _assertParams() {
    return !!this._rawMenuString;
  }

  _preprocessMenuString() {
    this._preprocessed = this._rawMenuString;

    this._removeSeriesOfDashes();
    this._removeComma();
    this._decodeHtml();
  }

  _removeSeriesOfDashes() {
    this._preprocessed = this._preprocessed
      .replace(/--+/g, '');
  }

  _removeComma() {
    this._preprocessed = this._preprocessed
      .replace(/,/g, '');
  }

  _decodeHtml() {
    this._preprocessed = this._preprocessed
      .replace(/&amp;/g, '\&')
      .replace(/&gt;/g, '\>')
      .replace(/&lt;/g, '\<')
      .replace(/&quot;/g, '\'')
      .replace(/&#39;/g, '\'');
  }

  _processMenuString() {
    this._inProcess = this._preprocessed;

    if (this._checkIfPricesTagExists()) {
      this._extractMultipleMenus();
    } else {
      this._extractSingleMenu();
    }
  }

  _checkIfPricesTagExists() {
    return /[0-9]원/.test(this._inProcess);
  }

  _extractMultipleMenus() {
    for (let delimiterPart = this._grepDelimiterPart();
         this._hasDelimiterPart();
         delimiterPart = this._grepNextDelimiterPart(delimiterPart)) {
      const price = this._getPriceFromDelimiterPart(delimiterPart);
      const calorie = this._getCalorieFromDelimiterPart(delimiterPart);
      const foods = this._getFoodsInCurrentContext(delimiterPart);

      if (foods.length > 0) {
        this._extractedMenus.push({
          foods: foods,
          price: price,
          calorie: calorie,
        });
      }
    }
  }

  _hasDelimiterPart() {
    return !!this._grepDelimiterPart();
  }

  _grepDelimiterPart() {
    return this._inProcess.match(/([0-9]+)원 *(([0-9]+)[Kk]cal)?/);
  }

  _getPriceFromDelimiterPart(delimiterPart) {
    return delimiterPart[1] || null;
  }

  _getCalorieFromDelimiterPart(delimiterPart) {
    return delimiterPart[3] || null;
  }

  _getFoodsInCurrentContext(delimiterPart) {
    return this._inProcess.slice(0, delimiterPart.index).trim();
  }

  _grepNextDelimiterPart(currentDelimiterPart) {
    this._inProcess = this._inProcess.slice(currentDelimiterPart.index + currentDelimiterPart[0].length);

    return this._grepDelimiterPart();
  }

  _extractSingleMenu() {
    this._extractedMenus.push({
      foods: this._inProcess,
      price: null,
      calorie: null,
    });
  }
}

export default MenuConverter;
