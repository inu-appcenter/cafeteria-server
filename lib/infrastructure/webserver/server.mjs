/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020 INU Appcenter <potados99@gmail.com>
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
'use strict';

import Hapi from '@hapi/hapi';
// Logs
import logger from 'common/utils/logger';

import LogTransform from 'infrastructure/webserver/log/LogTransform';
// Config
import config from 'root/lib/config/config';

import thisPackage from 'root/package';
// Auth
import UserValidatorImpl from 'interfaces/security/UserValidatorImpl';

import UserRepositoryImpl from 'interfaces/storage/UserRepositoryImpl';

const userValidator = new UserValidatorImpl(new UserRepositoryImpl());

async function createServer() {
  const server = Hapi.server({
    port: config.server.port,
  });

  await server.register([
    require('blipp'),
    require('@hapi/vision'),
    require('@hapi/inert'),
    require('hapi-auth-jwt2'),
    {
      plugin: require('hapi-swagger'),
      options: {
        info: {
          title: '카페테리아 서버 API',
          version: thisPackage.version,
        },
      },
    },
    {
      plugin: require('@hapi/good'),
      options: {
        ops: {
          interval: config.log.ops.interval,
        },
        reporters: {
          eventReporter: [
            {
              module: '@hapi/good-squeeze', /* filter events */
              name: 'Squeeze',
              args: [{ops: '*', log: '*', error: '*', response: '*'}],
            },
            {
              module: '@hapi/good-console', /* format to string */
              args: [{
                format: 'mm:ss.SSS',
              }],
            },
            new LogTransform(),
          ],
        },
      },
    },
  ]);

  server.auth.strategy('standard', 'jwt', {
    key: config.auth.key,
    validate: async (decoded, request, h) => {
      return userValidator.validate(decoded);
    },
    verifyOptions: {algorithms: ['HS256']},
  });

  await server.register([
    require('infrastructure/webserver/routes/public'),
    require('infrastructure/webserver/routes/transaction'),
    require('infrastructure/webserver/routes/cafeteria'),
    require('infrastructure/webserver/routes/corners'),
    require('infrastructure/webserver/routes/menus'),
    require('infrastructure/webserver/routes/user'),
  ]);

  logger.info('Server created.');

  return server;
}

module.exports = createServer;
