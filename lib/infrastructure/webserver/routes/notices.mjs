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

import BoomModel from './utils/BoomModel';
import Joi from '@hapi/joi';
import {createRoute} from './utils/helper';
import NoticeController from '../../../interfaces/controllers/NoticeController';

const responseModel = Joi.object({
  'id': Joi.number().description('공지 번호'),
  'title': Joi.string().description('제목'),
  'body': Joi.string().description('내용'),
}).label('Notice 모델');

const paramModel = Joi.object({
  'id': Joi.alternatives().try(
    Joi.string(),
    Joi.number(),
  ).description('공지 번호 또는 latest'),
});

const getAllNotices = {
    method: 'GET',
    path: '/notices',
    handler: NoticeController.getNotices,
    options: {
      description: '공지를 가져옵니다.',
      notes: ['서버에서 모든 공지사항을 가져옵니다.'],
      tags: ['api', 'notices'],
      response: {
        status: {
          200: Joi.array().items(responseModel),
          400: BoomModel,
          500: BoomModel,
        },
      },
    },
  };

const getNotice = {
  method: 'GET',
  path: '/notices/{id}',
  handler: NoticeController.getNotices,
  options: {
    description: '공지를 가져옵니다.',
    notes: ['서버에서 공지사항을 가져옵니다.'],
    tags: ['api', 'notices'],
    validate: {
      params: paramModel,
    },
    response: {
      status: {
        200: responseModel,
        400: BoomModel,
        500: BoomModel,
      },
    },
  },
};

export default createRoute('notice', getAllNotices, getNotice);
