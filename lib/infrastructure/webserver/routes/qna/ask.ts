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
import Ask from '../../../../application/qna/Ask';
import {defineRoute, defineSchema} from '@inu-cafeteria/backend-core';

const schema = defineSchema({
  body: {
    deviceInfo: z.string(),
    appVersion: z.string(),
    content: z.string(),
  },
});

export default defineRoute('post', '/ask', schema, async (req, res) => {
  const userId = req.requireUserId();
  const {deviceInfo, appVersion, content} = req.body;

  await Ask.run({userId, deviceInfo, appVersion, content});

  return res.send();
});
