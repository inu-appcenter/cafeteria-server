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

import resolve from '../../common/di/resolve';

import UserValidator from '../../domain/security/UserValidator';

import publicRoutes from './routes/public'; /* keyword public reserved in strict mode :( */
import transaction from './routes/transaction';
import cafeteria from './routes/cafeteria';
import corners from './routes/corners';
import menus from './routes/menus';
import user from './routes/user';

import logger from '../../common/utils/logger';
import config from '../../../config';
import LogTransform from './log/LogTransform';
import thisPackage from '../../../package';

import Hapi from '@hapi/hapi';
import Blipp from 'blipp';
import Vision from '@hapi/vision';
import Inert from '@hapi/inert';
import HapiAuthJwt2 from 'hapi-auth-jwt2';
import HapiSwagger from 'hapi-swagger';
import HapiGood from '@hapi/good';

const userValidator = resolve(UserValidator);

async function createServer() {
  const server = Hapi.server({
    port: config.server.port,
  });

  await server.register([
    Blipp,
    Vision,
    Inert,
    HapiAuthJwt2,
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: '카페테리아 서버 API',
          version: thisPackage.version,
        },
      },
    },
    {
      plugin: HapiGood,
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
    publicRoutes,
    transaction,
    cafeteria,
    corners,
    menus,
    user,
  ]);

  logger.info('Server created.');

  return server;
}

export default createServer;
