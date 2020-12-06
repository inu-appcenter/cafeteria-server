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

import logger from '../../../common/utils/logger';

import Stream from 'stream';
import config from '../../../../config';

const logTransformers = {
  ops: (data) => {

  },

  log: (data) => {
    return `ServerLog: [${data.tags.join(', ')}] ${JSON.stringify(data.data || data.error)}`;
  },

  response: (data) => {
    const withoutCredentials = (payload) => {
      for (const fieldName in payload) {
        if (!Object.hasOwnProperty.call(payload, fieldName)) {
          continue;
        }

        if (config.log.securedPayloads.indexOf(fieldName) > -1) {
          payload[fieldName] = '****';
        }
      }

      return payload;
    };

    return `RequestSent: ${data.method.toUpperCase()} request to ${data.path} with query(${JSON.stringify(data.query)}) and payload(${JSON.stringify(withoutCredentials(data.requestPayload))}) by user-agent(${data.source.userAgent}) from remote(${data.source.remoteAddress}) responded with code(${data.statusCode}).`;
  },

  error: (data) => {
    return `RequestError: ${data.method.toUpperCase()} ${data.url} failed with error: ${JSON.stringify(data.error)}`;
  },
};

class LogTransform extends Stream.Transform {
  constructor() {
    super({objectMode: true});
  }

  _transform(data, enc, next) {
    if (!data.event) {
      next(null);
    }

    const transformer = logTransformers[data.event];
    const transformed = transformer(data);

    logger.event(transformed);

    // Pass the data to the next handler.
    next(null);
  }
}

export default LogTransform;
