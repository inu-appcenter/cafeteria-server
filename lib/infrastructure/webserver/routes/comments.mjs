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

import Joi from '@hapi/joi';
import CafeteriaController from '../../../interfaces/controllers/CafeteriaController.mjs';
import BoomModel from './utils/BoomModel.mjs';
import {createRoute} from './utils/helper.mjs';

const paramModel = Joi.object({
  cafeteriaId: Joi.number().description('해당 Comment가 속한 Cafeteria의 id'),
}).label('Comment 파라미터 모델');

const responseModel = Joi.object({
  'comment': Joi.string().allow('').allow(null).description('Comment 내용'),
  'cafeteria-id': Joi.number().description('Comment가 속한 Cafeteria의 id'),
}).label('Comment 응답 모델');

const getAllCafeteriaComments = {
  method: 'GET',
  path: '/cafeteriaComments',
  handler: CafeteriaController.getComments,
  options: {
    description: 'CafeteriaComment를 모두 가져옵니다..',
    notes: ['CafeteriaComment를 가져와 직렬화하여 전달합니다.'],
    tags: ['api', 'comments'],
    response: {
      status: {
        200: Joi.array().items(responseModel),
        400: BoomModel,
        500: BoomModel,
      },
    },
  },
};

const getCafeteriaCommentByCafeteriaId = {
  method: 'GET',
  path: '/cafeteriaComments/{cafeteriaId}',
  handler: CafeteriaController.getComments,
  options: {
    description: '지정된 Cafeteria에 대한 Comment를 가져옵니다..',
    notes: ['URL에 주어진 Cafeteria id에 해당하는 Comment를 가져와 직렬화하여 전달합니다.'],
    tags: ['api', 'comments'],
    validate: {
      params: paramModel,
    },
    response: {
      status: {
        200: responseModel,
        400: BoomModel,
        404: BoomModel,
        500: BoomModel,
      },
    },
  },
};

export default createRoute('comments', getAllCafeteriaComments, getCafeteriaCommentByCafeteriaId);

