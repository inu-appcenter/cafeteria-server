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

'use strict';

import BarcodeTransformerImpl from '../../../../lib/interfaces/security/BarcodeTransformerImpl';
import LegacyTransactionConverter from '../../../../lib/interfaces/converters/LegacyTransactionConverter';
import DiscountTransaction from '../../../../lib/domain/entities/DiscountTransaction';

describe('# Convert', () => {
  const converter = new LegacyTransactionConverter({
    barcodeTransformer: new BarcodeTransformerImpl(),
  });

  const getResult = function(barcode, code, menu, now) {
    return converter.convert({
      barcode, code, menu, now,
    });
  };

  const timingTest = function(date, expectedMealType) {
    const result = getResult('1210209372', 1, 'blah', date);

    expect(result).toEqual(new DiscountTransaction({
      mealType: expectedMealType, /* newly added */

      userId: 201701562, /* extracted from 'barcode' */
      cafeteriaId: 4, /* 생활원식당, mapped from 'code' */
    }));
  };

  const cafeteriaIdTest = function(code, cafeteriaId) {
    const now = new Date();
    now.setHours(8, 50, 0);
    const result = getResult('1210209372', code, 'blah', now);

    expect(result).toEqual(new DiscountTransaction({
      mealType: 0, /* newly added */

      userId: 201701562, /* extracted from 'barcode' */
      cafeteriaId: cafeteriaId, /* 생활원식당, mapped from 'code' */
    }));
  };

  const barcodeTest = function(barcode, id) {
    const now = new Date();
    now.setHours(8, 50, 0);
    const result = getResult(barcode, 1, 'blah', now);

    expect(result).toEqual(new DiscountTransaction({
      mealType: 0, /* newly added */

      userId: id, /* extracted from 'barcode' */
      cafeteriaId: 4, /* 생활원식당, mapped from 'code' */
    }));
  };

  it('should set 0 at morning', async () => {
    const now = new Date();
    now.setHours(8, 50, 0);
    timingTest(now, 0);
  });

  it('should set 1 at lunch', async () => {
    const now = new Date();
    now.setHours(12, 50, 0);
    timingTest(now, 1);
  });

  it('should set 2 at dinner', async () => {
    const now = new Date();
    now.setHours(18, 50, 0);
    timingTest(now, 2);
  });

  it('should set -1 at night', async () => {
    const now = new Date();
    now.setHours(23, 50, 0);
    timingTest(now, -1);
  });

  it('should convert code 1 to 4(사범대식당)', async () => {
    cafeteriaIdTest(1, 4);
  });

  it('should convert code 2 to 3(생활원식당)', async () => {
    cafeteriaIdTest(2, 3);
  });

  it('should convert unknown code to -1', async () => {
    cafeteriaIdTest(99, -1);
  });

  it('should convert barcode under 2000000000', async () => {
    barcodeTest('1210209372', 201701562);
  });

  it('should convert barcode over 2000000000', async () => {
    barcodeTest('8068062480', 2017015620);
  });
});
