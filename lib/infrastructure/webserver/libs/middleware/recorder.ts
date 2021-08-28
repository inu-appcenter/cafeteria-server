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

import logger from '../../../../common/logging/logger';
import {RequestHandler} from 'express';

export default function recorder(): RequestHandler {
  return async (req, res, next) => {
    const {path, params, query, body} = req;

    const info = {
      remoteAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      path: path,
      params: redacted(params),
      query: redacted(query),
      body: redacted(body),
    };

    logger.info(`요청을 받았습니다: ${JSON.stringify(info)}`);

    next();
  };
}

function redacted(data: Record<string, any>): Record<string, any> {
  const copied = Object.assign({}, data);

  const secureFields = ['password'];
  for (const field of secureFields) {
    if (copied[field]) {
      copied[field] = '[삭제됨]';
    }
  }

  return copied;
}
