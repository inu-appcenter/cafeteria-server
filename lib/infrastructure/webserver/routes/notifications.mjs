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

import InteractionController from '../../../interfaces/controllers/InteractionController';

import BoomModel from './BoomModel';
import Joi from '@hapi/joi';

const responseModel = Joi.object({
  'title': Joi.string().description('알림 제목'),
  'body': Joi.string().description('알림 내용'),
}).label('Notification 모델');

export default {
  name: 'notifications',
  register: async (server) => {
    server.route([
      {
        method: 'GET',
        path: '/notifications',
        handler: InteractionController.getNotifications,
        options: {
          description: '알림을 가져옵니다.',
          notes: ['사용자 앞으로 도착한 모든 알림을 가져옵니다.'],
          tags: ['api', 'notifications'],
          response: {
            status: {
              200: Joi.array().items(responseModel),
              400: BoomModel,
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
