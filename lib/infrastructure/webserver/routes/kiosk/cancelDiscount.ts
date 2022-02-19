/**
 * This file is part of INU Cafeteria.
 *
 * Copyright 2021 INU Global App Center <potados99@gmail.com>
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

import {z} from 'zod';
import {stringAsInt} from '@inu-cafeteria/backend-core';
import CancelDiscountTransaction from '../../../../application/discount/CancelDiscountTransaction';
import {defineRoute, defineSchema} from '@inu-cafeteria/backend-core';

const schema = defineSchema({
  query: {
    barcode: z.string().optional(),
    cafeteriaId: stringAsInt.optional(),
  },
});

export default defineRoute('get', '/kiosk/discount/cancel', schema, async (req, res) => {
  const {barcode, cafeteriaId} = req.query;

  await CancelDiscountTransaction.run({barcode, cafeteriaId});

  return res.json({
    statusCode: 200,
    error: '',
    message: '성공',
  });
});
