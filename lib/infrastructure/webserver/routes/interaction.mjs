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
import {createRoute} from './utils/helper';

const questionInputModel = Joi.object({
  deviceInfo: Joi.string().description('기기 정보'),
  version: Joi.string().description('앱 버전'),
  content: Joi.string().description('피드백 본문'),
}).label('Question 입력 모델');

const questionResponseModel = Joi.object({
  'id': Joi.number().description('질문 번호'),
  'content': Joi.string().description('피드백 본문'),
  'created-at': Joi.number().description('질문 시각'),
}).label('Question 응답 모델');

const answerQueryModel = Joi.object({
  unreadOnly: Joi.boolean().optional().description('안 읽은 답변만 가져올지 여부'),
});

const answerResponseModel = Joi.object({
  'id': Joi.number().description('답변 번호'),
  'title': Joi.string().description('답변 제목'),
  'body': Joi.string().description('답변 내용'),
  'read': Joi.boolean().description('확인 여부'),
  'created-at': Joi.number().description('답변 시각'),
}).label('Answer 응답 모델');

const markAnswerReadParamModel = Joi.object({
  answerId: Joi.number().required().description('답변 번호'),
});

const ask = {
    method: 'POST',
    path: '/ask',
    handler: InteractionController.ask,
    options: {
      description: '문의합니다.',
      notes: ['사용자의 질문을 서버로 보냅니다.'],
      tags: ['api', 'ask'],
      validate: {
        payload: questionInputModel,
      },
      response: {
        status: {
          201: undefined,
          400: BoomModel,
          500: BoomModel,
        },
      },
      auth: {
        mode: 'required',
        strategy: 'standard',
      },
    },
  };

const getQuestions = {
  method: 'GET',
  path: '/questions',
  handler: InteractionController.getQuestions,
  options: {
    description: '남긴 질문을 가져옵니다.',
    notes: ['사용자가 남긴 모든 질문을 가져옵니다.'],
    tags: ['api', 'questions'],
    response: {
      status: {
        200: Joi.array().items(questionResponseModel),
        400: BoomModel,
        500: BoomModel,
      },
    },
    auth: {
      mode: 'required',
      strategy: 'standard',
    },
  },
};

const getAnswers = {
    method: 'GET',
    path: '/answers',
    handler: InteractionController.getAnswers,
    options: {
      description: '모든 답변을 가져옵니다.',
      notes: ['사용자 앞으로 도착한 모든 답변을 가져옵니다.'],
      tags: ['api', 'answers'],
      validate: {
        query: answerQueryModel,
      },
      response: {
        status: {
          200: Joi.array().items(answerResponseModel),
          400: BoomModel,
          500: BoomModel,
        },
      },
      auth: {
        mode: 'required',
        strategy: 'standard',
      },
    },
  };

const markAnswerRead = {
  method: 'POST',
  path: '/markAnswerRead/{answerId}',
  handler: InteractionController.markAnswerRead,
  options: {
    validate: {
      params: markAnswerReadParamModel,
    },
    response: {
      status: {
        204: undefined,
        400: BoomModel,
        500: BoomModel,
      },
    },
  },
};

export default createRoute('interaction', ask, getQuestions, getAnswers, markAnswerRead);
