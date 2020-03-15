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
  constructor() {
    super();
    this.cornerMenuKeys = [
      {id: 1, TYPE1: 1, TYPE2: 0, FOODMENU_TYPE: 1},
      {id: 2, TYPE1: 2, TYPE2: 0, FOODMENU_TYPE: 1},
      {id: 3, TYPE1: 3, TYPE2: 0, FOODMENU_TYPE: 1},
      {id: 4, TYPE1: 4, TYPE2: 0, FOODMENU_TYPE: 1},
      {id: 5, TYPE1: 5, TYPE2: 0, FOODMENU_TYPE: 1},
      {id: 6, TYPE1: 6, TYPE2: 0, FOODMENU_TYPE: 1},
      {id: 7, TYPE1: 7, TYPE2: 0, FOODMENU_TYPE: 1},
      {id: 8, TYPE1: 8, TYPE2: 0, FOODMENU_TYPE: 1},

      {id: 9, TYPE1: -1, TYPE2: -1, FOODMENU_TYPE: 2},
      {id: 10, TYPE1: -1, TYPE2: -1, FOODMENU_TYPE: 2},
      {id: 11, TYPE1: -1, TYPE2: -1, FOODMENU_TYPE: 2},

      {id: 12, TYPE1: 1, TYPE2: 2, FOODMENU_TYPE: 3},
      {id: 13, TYPE1: 1, TYPE2: 3, FOODMENU_TYPE: 3},

      {id: 14, TYPE1: -1, TYPE2: -1, FOODMENU_TYPE: 4},
      {id: 15, TYPE1: -1, TYPE2: -1, FOODMENU_TYPE: 4},
      {id: 16, TYPE1: -1, TYPE2: -1, FOODMENU_TYPE: 4},

      {id: 17, TYPE1: 1, TYPE2: 2, FOODMENU_TYPE: 5},
      {id: 18, TYPE1: 1, TYPE2: 3, FOODMENU_TYPE: 5},
    ];
    this.rawObject = null;

    // Array of Menu entity
    this.menus = [];
  }

  convert(rawObject) {
    this.rawObject = rawObject;
    return this._parse();
  }

  _parse() {
    if (!this._assertParams()) {
      logger.warn('both rawObject and cornerMenuKeys must be valid');
      return null;
    }

    const cafeteriaNumStart = 1;

    for (let cafeteriaNum = cafeteriaNumStart;
         this._rawCafeteriaExists(cafeteriaNum);
         cafeteriaNum++) {
      this._parseCorners(this._getRawCafeteria(cafeteriaNum));
    }

    return this.menus;
  }

  _assertParams() {
    return this.rawObject && this.cornerMenuKeys;
  }

  _rawCafeteriaExists(cafeteriaNum) {
    return !!this._getRawCafeteria(cafeteriaNum);
  }

  _getRawCafeteria(cafeteriaNum) {
    return this.rawObject[this._getCafeteriaFieldName(cafeteriaNum)];
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
    return this.cornerMenuKeys.find((corner) =>
      corner.TYPE1 === parseInt(rawCorner.TYPE1) &&
      corner.TYPE2 === parseInt(rawCorner.TYPE2) &&
      corner.FOODMENU_TYPE === parseInt(rawCorner.FOODMENU_TYPE),
    );
  }

  _parseMenus(rawMenus, cornerId) {
    const parsedMenus = new RawMenuParser().parseMenus(rawMenus);

    parsedMenus.forEach((menu) => {
      this.menus.push(new Menu({
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
    this.rawMenuString = '';
    this.preprocessed = '';
    this.inProcess = '';

    // Array of
    //  foods: string,
    //  price: number,
    //  calorie: number
    this.extractedMenus = [];
  }

  parseMenus(rawMenus) {
    this.rawMenuString = rawMenus;
    return this._parseAndExtractMenusFromDirtyRawString();
  }

  _parseAndExtractMenusFromDirtyRawString() {
    if (!this._assertParams()) {
      logger.warn('rawMenuString must be valid');
      return null;
    }

    this._preprocessMenuString();
    this._processMenuString();

    return this.extractedMenus;
  }

  _assertParams() {
    return !!this.rawMenuString;
  }

  _preprocessMenuString() {
    const dashesEliminated = this._removeSeriesOfDashes(this.rawMenuString);
    const commaRemoved = this._removeComma(dashesEliminated);
    this.preprocessed = this._decodeHtml(commaRemoved);
  }

  _removeSeriesOfDashes(string) {
    return string
      .replace(/--+/g, '');
  }

  _removeComma(string) {
    return string
      .replace(/,/g, '');
  }

  _decodeHtml(string) {
    return string
      .replace(/&amp;/g, '\&')
      .replace(/&gt;/g, '\>')
      .replace(/&lt;/g, '\<')
      .replace(/&quot;/g, '\'')
      .replace(/&#39;/g, '\'');
  }

  _processMenuString() {
    this.inProcess = this.preprocessed;

    if (this._checkIfPricesTagExists()) {
      this._extractMultipleMenus();
    } else {
      this._extractSingleMenu();
    }
  }

  _checkIfPricesTagExists() {
    return /[0-9]원/.test(this.inProcess);
  }

  _extractSingleMenu() {
    this.extractedMenus.push({
      foods: this.inProcess,
      price: null,
      calorie: null,
    });
  }

  _extractMultipleMenus() {
    for (let delimiterPart = this._grepDelimiterPart();
         this._hasDelimiterPart();
         delimiterPart = this._grepNextDelimiterPart(delimiterPart)) {
      const price = this._getPriceFromDelimiterPart(delimiterPart);
      const calorie = this._getCalorieFromDelimiterPart(delimiterPart);
      const foods = this._getFoodsInCurrentContext(delimiterPart);

      if (foods.length > 0) {
        this.extractedMenus.push({
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
    return this.inProcess.match(/([0-9]+)원 *(([0-9]+)[Kk]cal)?/);
  }

  _getPriceFromDelimiterPart(delimiterPart) {
    return delimiterPart[1] || null;
  }

  _getCalorieFromDelimiterPart(delimiterPart) {
    return delimiterPart[3] || null;
  }

  _getFoodsInCurrentContext(delimiterPart) {
    return this.inProcess.slice(0, delimiterPart.index).trim();
  }

  _grepNextDelimiterPart(currentDelimiterPart) {
    this.inProcess = this.inProcess.slice(currentDelimiterPart.index + currentDelimiterPart[0].length);

    return this._grepDelimiterPart();
  }
}

export default MenuConverter;
