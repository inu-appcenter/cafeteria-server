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
import config from '../../../../../config';
import StudentLogin from '../../../../application/user/StudentLogin';
import {defineRoute, defineSchema} from '@inu-cafeteria/backend-core';

const schema = defineSchema({
  body: {
    studentId: z.string(),
    password: z.string().optional(),
    rememberMeToken: z.string().optional(),
  },
});

export default defineRoute('post', '/student/login', schema, async (req, res) => {
  const {studentId, password, rememberMeToken} = req.body;

  const result = await StudentLogin.run({
    studentId,
    password,
    rememberMeToken,
  });

  return res
    .cookie(config.server.jwt.cookieName, result.jwt, config.server.jwt.cookieOptions)
    .json({
      rememberMeToken: result.rememberMeToken,
      barcode: result.barcode,
    });
});
