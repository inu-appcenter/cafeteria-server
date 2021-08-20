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

import rateLimit from 'express-rate-limit';
import {asyncHandler} from './handler';
import express, {RequestHandler} from 'express';
import {processRequest, RequestValidation} from './middleware/zod';

export function defineRoute<TParams = any, TQuery = any, TBody = any>(
  method: 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head',
  path: string,
  schema: RequestValidation<TParams, TQuery, TBody>,
  ...handlers: RequestHandler<TParams, any, TBody, TQuery>[]
): express.Router {
  const router = express.Router();

  router[method](path, processRequest(schema), ...handlers.map((h) => asyncHandler(h)));

  return router;
}

export const apiLimiter = rateLimit({
  windowMs: 1000 * 60 * 5, // 5분에
  max: 10, // 10번
  handler(req, res, next) {
    res.status(429).json({
      statusCode: 429,
      error: 'too_frequent',
      message: '해당 기능을 너무 빈번하게 사용하고 있습니다. 잠시 처리를 제한합니다.',
    });
  },
});
