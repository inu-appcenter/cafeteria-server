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

describe('# Legacy transaction converter', () => {
  it('should convert', async () => {
    const converter = new LegacyTransactionConverter({
      barcodeTransformer: new BarcodeTransformerImpl(),
    });

    const todayMorning = new Date();
    todayMorning.setHours(8, 50, 0); /* today morning. */

    const input = {
      barcode: '1210209372', /* 201701562 */
      code: 1,
      menu: 'blahblah',

      now: todayMorning,
    };

    const converted = converter.convert(input);
    const expected = new DiscountTransaction({
      token: 'blahblah', /* was 'menu' */
      mealType: 0, /* newly added */

      userId: 201701562, /* extracted from 'barcode' */
      cafeteriaId: 4, /* 생활원식당, mapped from 'code' */
    });

    expect(converted).toEqual(expected);
  });
});
