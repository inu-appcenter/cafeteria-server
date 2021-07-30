/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2021 INU Global App Center <potados99@gmail.com>
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
 * Express는 경로 파라미터와 쿼리 파라미터로 들어온 값들을 모두 스트링으로 다룹니다.
 * https://stackoverflow.com/questions/18057850/req-params-number-is-string-in-expressjs
 *
 * Zod를 제대로 쓰려면 숫자일 수 있는 것들은 숫자로 미리 바꿔주어야 합니다.
 */
export const numberParser: RequestHandler<any, any, any, any> = (req, res, next) => {
  // 경로 파라미터
  for (const propName of Object.keys(req.params)) {
    const value = req.params[propName];

    if (isEffectivelyNumber(value)) {
      // @ts-ignore
      req.params[propName] = toNumber(value);
    }
  }

  // 쿼리 파라미터
  for (const propName of Object.keys(req.query)) {
    const value = req.query[propName];

    if (typeof value !== 'string') {
      continue;
    }

    if (isEffectivelyNumber(value)) {
      // @ts-ignore
      req.query[propName] = toNumber(value);
    }
  }

  next();
};

function isEffectivelyNumber(numberLike: string) {
  return !Number.isNaN(toNumber(numberLike));
}

function toNumber(numberLike: string) {
  return parseInt(numberLike, 10);
}
