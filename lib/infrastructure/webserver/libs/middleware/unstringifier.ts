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
import {isNumeric} from '../../../../common/utils/number';

type Catcher<T> = {
  catch: (value: string) => boolean;
  parse: (value: string) => T;
};

const intCatcher: Catcher<number> = {
  catch: (value) => isNumeric(value),
  parse: (value) => parseInt(value, 10),
};

const booleanCatcher: Catcher<boolean> = {
  catch: (value) => ['true', 'false'].includes(value),
  parse: (value) => value === 'true',
};

const primitiveCatchers = [intCatcher, booleanCatcher];

/**
 * Express는 경로 파라미터와 쿼리 파라미터로 들어온 값들을 모두 스트링으로 다룹니다.
 * https://stackoverflow.com/questions/18057850/req-params-number-is-string-in-expressjs
 *
 * Zod를 제대로 쓰려면 숫자나 boolean처럼 스트링으로 포괄적으로 나타내어지는 타입들을 구분해내야 합니다.
 */
export function unstringifier(): RequestHandler<any, any, any, any> {
  return (req, res, next) => {
    transformFields(req.params, primitiveCatchers);
    transformFields(req.query, primitiveCatchers);

    next();
  };
}

function transformFields(object: Record<string, any>, catchers: Catcher<any>[]) {
  for (const propName of Object.keys(object)) {
    const value = object[propName];

    for (const catcher of catchers) {
      if (catcher.catch(value)) {
        object[propName] = catcher.parse(value);
      }
    }
  }
}
