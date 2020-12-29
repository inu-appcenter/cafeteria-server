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
import BoomModel from './utils/BoomModel.mjs';
import WaitingOrderController from '../../../interfaces/controllers/WaitingOrderController.mjs';
import {createRoute} from './utils/helper.mjs';

const waitingOrderFetchQueryModel = Joi.object({
  deviceIdentifier: Joi.string().required().description('대기주문을 등록한 기기의 식별자'),
}).label('WaitingOrder 쿼리 모델');

const waitingOrderResponseModel = Joi.object({
  'id': Joi.number().description('대기주문 식별자'),
  'number': Joi.number().description('주문 번호'),
  'cafeteria-id': Joi.number().description('주문한 식당의 id'),
}).label('WaitingOrder 모델');

const waitingOrderPostModel = Joi.object({
  number: Joi.number().required().description('주문 번호'),
  posNumber: Joi.number().allow(null).description('주문한 키오스크의 POS 번호'),
  cafeteriaId: Joi.number().allow(null).description('주문한 식당의 id'),
  deviceIdentifier: Joi.string().required().description('기기의 식별자'),
}).label('WaitingOrder 생성 입력 모델');

const orderReadyQueryModel = Joi.object({
  number: Joi.number().required().description('주문 번호'),
  code: Joi.number().required().description('레거시 cafe code'),
}).label('pushNumber 쿼리 모델');

const waitingOrderDeleteParamModel = Joi.object({
  orderId: Joi.number().required().description('삭제할 주문의 id'),
}).label('WaitingOrder 삭제 파라미터 모델');

const orderDeleteQueryModel = Joi.object({
  deviceIdentifier: Joi.string().required().description('대기주문을 등록한 기기의 식별자'),
}).label('WaitingOrder 삭제 쿼리 모델');

const getAllWaitingOrders = {
  method: 'GET',
  path: '/orders',
  handler: WaitingOrderController.getWaitingOrders,
  options: {
    description: '대기중인 주문을 가져옵니다.',
    notes: ['사용자가 등록한 주문 중 아직 완료되지 않은 주문을 모두 가져옵니다.'],
    tags: ['api', 'orders'],
    validate: {
      query: waitingOrderFetchQueryModel,
    },
    response: {
      status: {
        200: Joi.array().items(waitingOrderResponseModel),
        400: BoomModel,
        500: BoomModel,
      },
    },
  },
};

const addOrder = {
  method: 'POST',
  path: '/orders',
  handler: WaitingOrderController.addWaitingOrder,
  options: {
    description: '대기 주문을 등록합니다.',
    notes: ['알림을 받기 위해 주문을 등록합니다.'],
    tags: ['api', 'orders'],
    validate: {
      payload: waitingOrderPostModel,
    },
    response: {
      status: {
        204: undefined,
        400: BoomModel,
        403: BoomModel,
        404: BoomModel,
        500: BoomModel,
      },
    },
  },
};

const deleteOrder = {
  method: 'DELETE',
  path: '/orders/{orderId}',
  handler: WaitingOrderController.deleteWaitingOrder,
  options: {
    description: '대기 주문을 삭제합니다.',
    notes: ['등록된 대기 주문을 삭제합니다.'],
    tags: ['api', 'orders'],
    validate: {
      params: waitingOrderDeleteParamModel,
      query: orderDeleteQueryModel,
    },
    response: {
      status: {
        204: undefined,
        400: BoomModel,
        403: BoomModel,
        404: BoomModel,
        500: BoomModel,
      },
    },
  },
};

const pushNumber = {
  method: 'GET',
  path: '/pushNumber',
  handler: WaitingOrderController.pushNumber,
  options: {
    description: '[Private] 완료된 주문을 알립니다.',
    notes: ['완료된 주문을 알리는 webhook입니다.'],
    tags: ['api', 'orders'],
    validate: {
      query: orderReadyQueryModel,
    },
    response: {
      status: {
        204: undefined,
        400: BoomModel,
        404: BoomModel,
        500: BoomModel,
      },
    },
  },
};

export default createRoute('waiting orders', getAllWaitingOrders, addOrder, deleteOrder, pushNumber);
