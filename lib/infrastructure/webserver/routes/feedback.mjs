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

import BoomModel from './utils/BoomModel';
import Joi from '@hapi/joi';

const feedbackParamModel = Joi.object({
  content: Joi.string().description('피드백 본문'),
}).label('Feedback 파라미터 모델');

const responseModel = Joi.object({
  'title': Joi.string().description('알림 제목'),
  'body': Joi.string().description('알림 내용'),
}).label('FeedbackReply 모델');

export default {
  name: 'feedback',
  register: async (server) => {
    server.route([
      {
        method: 'POST',
        path: '/feedback',
        handler: InteractionController.writeFeedback,
        options: {
          description: '피드백을 보냅니다.',
          notes: ['사용자의 피드백을 서버로 보냅니다.'],
          tags: ['api', 'feedback'],
          validate: {
            payload: feedbackParamModel,
          },
          response: {
            status: {
              204: undefined,
              400: BoomModel,
              500: BoomModel,
            },
          },
          auth: {
            mode: 'optional',
            strategy: 'standard',
          },
        },
      },
      {
        method: 'GET',
        path: '/feedbackReplies',
        handler: InteractionController.getFeedbackReplies,
        options: {
          description: '피드백에 달린 답장을 가져옵니다.',
          notes: ['사용자 앞으로 도착한 모든 피드백 답장을 가져옵니다.'],
          tags: ['api', 'replies'],
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
