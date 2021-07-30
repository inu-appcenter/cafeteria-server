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

import {z} from 'zod';
import {defineSchema} from '../../libs/schema';
import {defineRoute} from '../../libs/route';
import GetMenus from '../../../../application/menu/GetMenus';

const schema = defineSchema({
  query: {
    cornerId: z.number().optional(),
    date: z.number().optional(),
    dateOffset: z.number().optional(),
  },
});

export default defineRoute('get', '/menus', schema, async (req, res) => {
  const {cornerId, date, dateOffset} = req.query;

  const menus = await GetMenus.run({cornerId, date: date?.toString(), dateOffset});

  return res.json(menus);
});
