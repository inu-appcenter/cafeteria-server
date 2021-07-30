/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2021 INU Global App Center <potados99@gmail.com>
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

import {defineSchema} from '../../libs/schema';
import {defineRoute} from '../../libs/route';
import GetCafeteria from '../../../../application/cafeteria/GetCafeteria';
import {z} from 'zod';

const schema = defineSchema({
  query: {
    withCorners: z.boolean().optional(),
  },
});

export default defineRoute('get', '/cafeteria', schema, async (req, res) => {
  const {withCorners} = req.query;

  const allCafeteria = await GetCafeteria.run({withCorners});

  return res.json(allCafeteria);
});
