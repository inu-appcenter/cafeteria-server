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

import BaseConverter from '../../domain/converter/BaseConverter';
import DiscountTransaction from '../../domain/entities/DiscountTransaction';
import dateUtil from '../../common/utils/dateUtil';

/**
 * Convert legacy payment queries(barcode, code, menu, payment) to
 * domain DiscountTransaction object.
 */
class LegacyTransactionConverter extends BaseConverter {
  constructor(barcodeTransformer) {
    super();
    this.barcodeTransformer = barcodeTransformer;
  }

  onConvert({barcode, code, now=null}) {
    if (!barcode || !code) {
      return null;
    }

    // Used to convert code(a.k.a. cafeCode) to cafeteriaId
    const oldApiIdToCafeteriaId = {
      1: 4, /* 생활원식당 */
      2: 3, /* 사범대식당 */
    };

    // Used to get current time range as a number [0, 1, 2, 3].
    const timeRanges = [
      {start: [7, 25], end: [9, 35]}, /* breakfast */
      {start: [10, 20], end: [14, 10]}, /* lunch */
      {start: [16, 30], end: [23, 40]}, /* dinner */
    ];

    return new DiscountTransaction({
      mealType: dateUtil.isBetween(now || new Date(), timeRanges),

      userId: this.barcodeTransformer.extractIdFromBarcode(barcode),
      cafeteriaId: oldApiIdToCafeteriaId[code],
    });
  }
}

export default LegacyTransactionConverter;
