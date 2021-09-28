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

import {defineSchema} from '../libs/schema';
import {defineRoute} from '../libs/route';
import {z} from 'zod';
import {logger} from '@inu-cafeteria/backend-core';

const schema = defineSchema({
  query: {
    statusCheck: z.string().optional(),
  },
});

export default defineRoute('get', '/', schema, async (req, res) => {
  const {statusCheck} = req.query;
  if (statusCheck) {
    logger.info(`상태체크(${statusCheck})! 건강합니다!`);
  }

  res.send(
    `카페테리아 API 서버입니다. ${new Date().toLocaleString()} 현재 정상 작동중입니다. 문제 생기면 010-2922-2661(앱센터 송병준) 연락 주세요.`
  );
});
