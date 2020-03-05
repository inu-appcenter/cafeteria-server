/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020 INU Global Appcenter <potados99@gmail.com>
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

'use strict';

import logger from 'common/utils/logger';

import Menu from 'domain/entities/Menu';
import BaseConverter from 'domain/converter/BaseConverter';

/**
 * Split multiple menus ins a single corner into triples of
 * 'foods', 'price', and 'calorie'.
 *
 * @param  {string} combined an all-combined menu string.
 * @return  {array} array of object with these keys:
 * 'foods', 'price', and 'calorie'.
 */
function split(combined) {
  if (!combined) {
    logger.warn('split: wrong parameter', TAG);
    return null;
  }
  // Some input string comes like:
  //
  //  '가자미튀김강정 짜장우동면 두부김치국 비엔나케찹조림 김구이*양념장 케일치커리겉절이
  //  깍두기 흑미밥 5,500원 659kcal ----------- 순대국밥/수육국밥 [부추+양파절임+김치+밥]
  //  5,500원 셀프라면 2,000원'
  //
  // We can see unnecessary dashes(-) and commas(,) in the string.
  // First we have to remove them all.
  //
  // The menus are separated by price string.
  // If no price specification in the string, just return it
  // with null price and calorie.
  // On the other hand we need to split them.
  // The delimiter, or the separator could be (price tag) or
  // (price tag + calorie tag).
  // We use regex /([0-9]+)원 *(([0-9]+)[Kk]cal)?/ to grep them.

  // Preprocess
  let preprocessed = combined.replace(/-/g, '').replace(/,/g, '');

  if (!/[0-9]원/.test(preprocessed)) {
    // No price tag.
    return [{
      foods: preprocessed,
      price: null,
      calorie: null,
    }];
  }

  // To be returned.
  const result = [];

  while (preprocessed !== '') {
    const matched = preprocessed.match(/([0-9]+)원 *(([0-9]+)[Kk]cal)?/);

    // If nothing matched in the string, no need to keep the task.
    if (!matched) {
      break;
    }

    // Make undifined to null.
    // If any required field is undefined, it will be classified as
    // non valid data.
    const price = matched[1] ? matched[1] : null;
    const calorie = matched[3] ? matched[3] : null;
    const foods = preprocessed.slice(0, matched.index).trim();

    // Add if length of foods is not zero, which means non-empty.
    if (foods.length !== 0) {
      result.push({
        foods: foods,
        price: price,
        calorie: calorie,
      });
    }

    // Cut already processed string and leave the other.
    preprocessed = preprocessed.slice(matched.index + matched[0].length);
  }

  return result;
}

/**
 * Parse a raw json object (not a string!) to an array of menu.
 *
 * @param  {Object} rawObject unrectified dirty garbage
 * @param  {Object} cornerMenuKeys array of
 * (id, FOODMENU_TYPE, TYPE1, and TYPE2).
 * @return  {array}  array of {@link Menu}.
 */
function parse(rawObject, cornerMenuKeys) {
  if (!rawObject || !cornerMenuKeys) {
    logger.warn('parse: wrong parameter');
    return null;
  }

  // Lets see,
  // the raw object consists of these fields(keys):
  //
  //   foodMenuType1Result
  //  foodMenuType2Result
  //   foodMenuType3Result
  //  foodMenuType4Result
  //  foodMenuType5Result
  //  afterDay
  //  beforeDay
  //
  // I coudn't even get closed to the toughts the dev had.
  // He(She) must have been crazy :(
  // However, looking inside them, the foodMenuType(1~5)Result is an array
  // with following contents:
  //
  //  TYPE2      :   WTF?
  //  FOODMENU_TYPE  :  WTF?
  //  STD_DATE    :  Oh ya, date!
  //  MENU      :  Food menu string, containing menus, price, and calori.
  //  TYPE1      :  WTF?
  //
  // Fuck.
  //
  // Oh if you wanna see the god damn motherfucking raw json you can just enter
  // https://sc.inu.ac.kr/inumportal/main/info/life/foodmenuSearch?stdDate=2020mmdd
  // and see the fucking result.
  //
  // Our mission is to refine them and create a pretty json objects like:
  //
  //  [
  //    {
  //      'cornerId': 1,
  //      'foods': 'blah blah whatever something',
  //      'price': '3500',
  //      'calorie': 335
  //    },
  //    ...
  //  ]

  // To be returned.
  const result = [];

  // Get a lambda that makes a formated string.
  const getFieldName = (n) => 'foodMenuType' + n + 'Result';

  let n = 1;
  let corners = rawObject[getFieldName(n++)];
  while (corners) {
    for (const corner of corners) {
      // We need to specify the corner in the profiles to get the corner id.
      // There is no similar thing as corner id in the raw object, so we need
      // an un-directional method.
      //
      // Each corner in the raw object has 'TYPE1', 'TYPE2',
      // and 'FOODMENU_TYPE' keys.
      // We will use combination of them as a search key.

      const found = cornerMenuKeys.find((c) =>
        c.TYPE1 === corner.TYPE1 &&
        c.TYPE2 === corner.TYPE2 &&
        c.FOODMENU_TYPE === corner.FOODMENU_TYPE,
      );

      // It is important to check if the corner.MENU is not null nor undefined
      // because we need to pass split only valid string.
      if (found && corner.MENU) {
        const splited = split(corner.MENU);
        for (const menu of splited) {
          result.push(new Menu({
            foods: menu.foods,
            price: menu.price,
            calorie: menu.calorie,

            cornerId: found.id,
          }));
        }
      }
    }

    corners = rawObject[getFieldName(n++)];
  }

  return result;
}

class MenuConverter extends BaseConverter {
  constructor() {
    super();

    /**
     * Hardcoded corner-menu match keys
     */
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
  }

  convert(rawObject) {
    return parse(rawObject, this.cornerMenuKeys);
  }
}

export default MenuConverter;
