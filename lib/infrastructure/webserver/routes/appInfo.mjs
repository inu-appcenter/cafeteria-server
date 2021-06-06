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
import BoomModel from './utils/BoomModel';
import {createRoute} from './utils/helper';
import AppInfoController from '../../../interfaces/controllers/AppInfoController';

const versionCheckQueryModel = Joi.object({
  os: Joi.string().description('기기 운영체제'),
  version: Joi.string().description('설치된 앱 버전'),
}).label('버전 확인 쿼리 모델');

const shouldIUpdate = {
  method: 'GET',
  path: '/shouldIUpdate',
  handler: AppInfoController.shouldIUpdate,
  options: {
    description: '[DEPRECATED] 앱을 업데이트해야 하는지 알아냅니다.',
    notes: ['[DEPRECATED] 기기 운영체제에 대해 현재 요구되는 최소 버전을 기반으로 업데이트가 필요한지 알아냅니다.'],
    tags: ['deprecated', 'api', 'app info', 'update'],
    validate: {
      query: versionCheckQueryModel,
    },
    response: {
      status: {
        200: Joi.boolean(),
        400: BoomModel,
        500: BoomModel,
      },
    },
  },
};

export default createRoute('app info', shouldIUpdate);
