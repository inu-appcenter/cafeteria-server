/**
 * This file is part of INU Cafeteria.
 *
 * Copyright 2021 INU Global App Center <potados99@gmail.com>
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

import {BadRequest, InternalServerError, NotFound} from '@inu-cafeteria/backend-core';

export const ResourceNotFound = NotFound.of(
  'resource_not_found',
  '요청한 리소스를 찾을 수 없습니다.'
);

export const ThisWillNeverHappen = InternalServerError.of(
  'this_will_never_happen',
  '있을 수 없는 일이 일어났습니다.'
);

export const MissingRequiredParameters = BadRequest.of(
  'missing_required_parameters',
  '필수 파라미터가 누락되었습니다.'
);
