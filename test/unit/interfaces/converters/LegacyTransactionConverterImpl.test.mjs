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

import BarcodeTransformerImpl from '../../../../lib/interfaces/security/BarcodeTransformerImpl';
import LegacyTransactionConverter from '../../../../lib/interfaces/converters/LegacyTransactionConverter';
import DiscountTransaction from '../../../../lib/domain/entities/DiscountTransaction';
import TransactionRepositoryMock from '../../../mocks/TransactionRepositoryMock';
import MockDate from 'mockdate';
import MealType from '../../../../lib/domain/constants/MealType.js';

describe('# Convert', () => {
  const converter = new LegacyTransactionConverter({
    barcodeTransformer: new BarcodeTransformerImpl(),
    transactionRepository: new TransactionRepositoryMock(),
  });

  const getResult = async function(barcode, code) {
    return converter.convert({
      barcode, code,
    });
  };

  const timingTest = async function(date, expectedMealType) {
    MockDate.set(date);

    const result = await getResult('1210209372', 1);

    expect(result).toEqual(new DiscountTransaction({
      mealType: expectedMealType, /* newly added */

      userId: 201701562, /* extracted from 'barcode' */
      cafeteriaId: 4, /* 생활원식당, mapped from 'code' */
    }));

    MockDate.reset();
  };

  const cafeteriaIdTest = async function(code, cafeteriaId) {
    const now = new Date();
    now.setHours(8, 50, 0);
    MockDate.set(now);

    const result = await getResult('1210209372', code);

    expect(result).toEqual(new DiscountTransaction({
      mealType: result.cafeteriaId > 0 ? MealType.BREAKFAST/*fixed 8:50 breakfast*/ : MealType.NONE/*could not find cafeteria->no meal type*/,

      userId: 201701562, /* extracted from 'barcode' */
      cafeteriaId: cafeteriaId, /* 생활원식당, mapped from 'code' */
    }));

    MockDate.reset();
  };

  const barcodeTest = async function(barcode, id) {
    const now = new Date();
    now.setHours(8, 50, 0);
    MockDate.set(now);

    const result = await getResult(barcode, 1);

    expect(result).toEqual(new DiscountTransaction({
      mealType: MealType.BREAKFAST, /* fix to BREAKFAST (time is set to 08:50). */

      userId: id, /* extracted from 'barcode' */
      cafeteriaId: 4, /* 생활원식당, mapped from 'code' */
    }));

    MockDate.reset();
  };

  it('should set 4 at morning', async () => {
    const now = new Date();
    now.setHours(8, 50, 0);
    await timingTest(now, MealType.BREAKFAST);
  });

  it('should set 2 at lunch', async () => {
    const now = new Date();
    now.setHours(12, 50, 0);
    await timingTest(now, MealType.LUNCH);
  });

  it('should set 1 at dinner', async () => {
    const now = new Date();
    now.setHours(18, 50, 0);
    await timingTest(now, MealType.DINNER);
  });

  it('should set 0 at night', async () => {
    const now = new Date();
    now.setHours(23, 50, 0);
    await timingTest(now, MealType.NONE);
  });

  it('should convert code 1 to 4(사범대식당)', async () => {
    await cafeteriaIdTest(1, 4);
  });

  it('should convert code 2 to 3(생활원식당)', async () => {
    await cafeteriaIdTest(2, 3);
  });

  it('should convert unknown code to -1', async () => {
    await cafeteriaIdTest(99, -1);
  });

  it('should convert barcode under 2000000000', async () => {
    await barcodeTest('1210209372', 201701562);
  });

  it('should convert barcode over 2000000000', async () => {
    await barcodeTest('8068062480', 2017015620);
  });
});
