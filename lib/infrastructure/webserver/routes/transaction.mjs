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

/******************************WARNING******************************
 * This router contains old APIs which are vulnerable and unsafe.
 * Those are still (Feb 2020) used by UICOOP POS system,
 * so they cannot be changed or upgraded easilly.
 *******************************************************************/

/**
 * A Deep Dive into The Old API Implemenation.
 *
 * This description is based on commits in 2018, 2019 of this repository
 * (https://github.com/inu-appcenter/cafeteria-server).
 *
 * SYNOPSIS:
 * This server serves for both client (students) and UICOOP.
 *
 * DESCRIPTION:
 * Once a user opens an app and enable [his|her] barcode,
 * this erver writes the status change to its DB.
 * Now the server is ready to get a request from UICOOP.
 *
 * The user then tags the barcode to the POS machine of a cafeteria.
 * The machine makes use of two APIs: /isBarcode, and /paymentSend.
 *
 * The former is called right after the user tags the barcode.
 * It check these conditions:
 *
 * (in time where discount is available) && (barcode activated) &&
 * (has not received discount in the same day) &&
 * (last barcode tag more than 15 secs ago)
 *
 * The latter is called after the whole payment process is done.
 * It also check these conditions:
 *
 * (it should say 'Y', which means confirm the discount) &&
 * (no dups in transaction table)
 *
 * SUMMARY:
 * - /isBarcode: check if a discount is available for the user.
 * - /paymentSend: confirm or cancel the discount.
 */

import DiscountTransactionController from '../../../interfaces/controllers/DiscountTransactionController';

import BoomModel from './BoomModel';
import Joi from '@hapi/joi';

/**
 * res/req model definitions for /isBarcode API.
 */
const discountAvailabilityCheckQueryModel = Joi.object({
  barcode: Joi.string().description('사용자가 태그한 바코드'),
  code: Joi.number().description('사용자가 태그한 식당 코드. cafeteriaId와 호환 안됨.'),
  menu: Joi.string().description('식당에 부여된 고유 토큰'),
}).label('isBarcode 쿼리 모델');

const discountAvailabilityCheckUsualResponseModel = Joi.object({
  message: Joi.string().description('요청이 별 탈 없이 처리되었으면 SUCCESS'),
  activated: Joi.number().description('할인받을 수 있다면 1, 아니면 0'),
}).label('isBarcode 통상 응답 모델');

const discountAvailabilityCheckUnusualResponseModel = Joi.object({
  message: Joi.string().description('실패한 이유'),
}).label('isBarcode 특이 응답 모델');

/**
 * res/res model definitions for /paymentSend API.
 */
const commitDiscountTransactionQueryModel = Joi.object({
  barcode: Joi.string().description('사용자가 태그한 바코드'),
  code: Joi.number().description('사용자가 태그한 식당 코드. cafeteriaId와 호환 안됨.'),
  menu: Joi.string().description('식당에 부여된 고유 토큰'),
  payment: Joi.string().description('트랜잭션 기록/삭제 여부'),
}).label('paymentSend 쿼리 모델');

const commitDiscountTransactionResponseModel = Joi.object({
  message: Joi.string().description('성공 또는 실패 여부를 나타내는 메시지'),
}).label('paymentSend 응답 모델');

export default {
  name: 'transaction',
  version: '0.1.0',
  register: async (server) => {
    server.route([
      {
        method: 'PUT',
        path: '/activateBarcode',
        handler: DiscountTransactionController.activateBarcode,
        options: {
          description: '바코드 활성화를 요청합니다.',
          notes: ['바코드를 10분간 사용 가능하게 합니다.'],
          tags: ['api', 'transaction'],
          response: {
            status: {
              204: undefined,
              401: BoomModel, /* could be blocked by auth below. */
              500: BoomModel,
            },
          },
          auth: {
            mode: 'required',
            strategy: 'standard',
          },
        },
      },

      /**
       * This old API /isBarcode.
       */
      {
        method: 'GET',
        path: '/isBarcode',
        handler: DiscountTransactionController.checkDiscountAvailability,
        options: {
          description: '[Private] 할인을 제공할 수 있는지 여부를 판단합니다.',
          notes: [
            '할인 적용 시간, 바코드 활성화 여부, 최근 할인 기록 등을 종합하여 할인 가능 여부를 판단합니다.',
          ],
          tags: ['api', 'transaction'],
          validate: {
            query: discountAvailabilityCheckQueryModel,
          },
          response: {
            status: {
              200: discountAvailabilityCheckUsualResponseModel,
              400: discountAvailabilityCheckUnusualResponseModel,
              500: BoomModel,
            },
          },
        },
      },

      /**
       * This old API /paymentSend.
       */
      {
        method: 'GET',
        path: '/paymentSend',
        handler: DiscountTransactionController.commitDiscountTransaction,
        options: {
          description: '[Private] 할인 트랜잭션을 확정하여 기록 또는 삭제합니다.',
          notes: ['할인 내역을 서버에 추가 또는 삭제합니다.'],
          tags: ['api', 'transaction'],
          validate: {
            query: commitDiscountTransactionQueryModel,
          },
          response: {
            status: {
              /**
               * Why only 200? I don't know.
               * It was just written in the old code.
               */
              200: commitDiscountTransactionResponseModel,
              500: BoomModel,
            },
          },
        },
      },
    ]);
  },
};
