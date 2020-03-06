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

import UserController from '../../../interfaces/controllers/UserController';

import Joi from '@hapi/joi';
import BoomModel from './BoomModel';

const responseModel = Joi.object({
  'id': Joi.number().required().description('학번'),
  'token': Joi.string().description('로그인 토큰'),
  'barcode': Joi.string().description('학생할인 바코드'),
}).label('User 모델');

const loginParamModel = Joi.object({
  token: Joi.string().allow('').allow(null).optional().description('토큰'),
  id: Joi.string().allow('').allow(null).optional().description('학번'),
  password: Joi.string().allow('').allow(null).optional().description('비밀번호'),
}).label('Login 파라미터 모델');

export default {
  name: 'user',
  version: '1.0.0',
  register: async (server) => {
    server.route([
      {
        method: 'POST',
        path: '/login',
        handler: UserController.login,
        options: {
          description: '로그인을 요청합니다.',
          notes: ['카페테리아 할인 대상자 여부를 판단하여 로그인을 처리합니다.'],
          tags: ['api', 'user'],
          validate: {
            payload: loginParamModel,
          },
          response: {
            status: {
              200: responseModel,
              400: BoomModel,
              401: BoomModel, /* could be blocked by auth below. */
              403: BoomModel,
              500: BoomModel,
            },
          },
          auth: {
            mode: 'try',
            strategy: 'standard',
          },
        },
      },
      {
        method: 'POST',
        path: '/logout',
        handler: UserController.logout,
        options: {
          description: '로그아웃을 요청합니다.',
          notes: ['세션을 종료합니다.'],
          tags: ['api', 'user'],
          response: {
            status: {
              204: Joi.string().empty(''),
              401: BoomModel, /* blocked by auth below. */
              500: BoomModel,
            },
          },
          auth: {
            mode: 'required',
            strategy: 'standard',
          },
        },
      },
    ]);
  },
};
