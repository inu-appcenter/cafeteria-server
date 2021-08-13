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
import Login from '../../../../application/user/Login';
import config from '../../../../../config';

const schema = defineSchema({
  body: {
    studentId: z.string(),
    password: z.string().optional(),
    rememberMeToken: z.string().optional(),
  },
});

export default defineRoute('post', '/login', schema, async (req, res) => {
  const {studentId, password, rememberMeToken} = req.body;

  const result = await Login.run({
    studentId,
    password,
    rememberMeToken,
  });

  return res
    .cookie(config.server.jwt.cookieName, result.jwt, config.server.jwt.cookieOptions)
    .json({
      barcode: result.barcode,
      rememberMeToken: result.rememberMeToken,
    });
});
