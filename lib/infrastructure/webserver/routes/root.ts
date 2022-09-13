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
import {defineRoute, defineSchema, logger} from '@inu-cafeteria/backend-core';
import packageInfo from '../../../../package.json';

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
    `<iframe src='https://contacts.inuappcenter.kr?service=cafeteria' style='border: none;'></iframe><br><br>
    카페테리아 API 서버 v${packageInfo.version} 
    / 서버시각 ${new Date().toLocaleString()} 
    / 서버 정상 작동중입니다. 문제 생기면 연락 주세요 :)`
  );
});
