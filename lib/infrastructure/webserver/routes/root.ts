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

import {defineRoute} from '../utils/route';
import Joi from 'joi';
import {defineHandler} from '../utils/handler';

const getRootQuery = Joi.object({
  name: Joi.string().required().description('당신의 이름'),
}).label('최상위 hello 요청 쿼리스트링 파라미터');

const handler = defineHandler(async (request) => {
  return `안녕 ${request.query.name}!`;
});

export default defineRoute('get', '/', handler, {
  validate: {
    query: getRootQuery,
  },
  auth: false,
});
