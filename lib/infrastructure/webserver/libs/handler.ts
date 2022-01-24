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

import {RequestHandler} from 'express';

/**
 * Express 4에서는 기본적으로 Promise rejection을 잡지 못합니다.
 * 그래서 이걸로 한 번 감싸줍니다.
 *
 * @param handler 원래 핸들러.
 */
export function asyncHandler<TParams = any, TQuery = any, TBody = any>(
  handler: RequestHandler<TParams, any, TBody, TQuery>
): RequestHandler<TParams, any, TBody, TQuery> {
  return (req, res, next) => {
    return Promise.resolve(handler(req, res, next)).catch(next);
  };
}
