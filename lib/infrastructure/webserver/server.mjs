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

import Authenticator from '../../domain/security/Authenticator';

import logger from '../../common/utils/logger';
import config from '../../../config';
import thisPackage from '../../../package';
import LogTransform from './log/LogTransform';

import Hapi from '@hapi/hapi';
import Blipp from 'blipp';
import Vision from '@hapi/vision';
import Inert from '@hapi/inert';
import HapiAuthJwt2 from 'hapi-auth-jwt2';
import HapiSwagger from 'hapi-swagger';
import HapiGood from '@hapi/good';

async function createServer() {
  const server = getServer();
  await setupServer(server);

  logger.info('Server created.');

  return server;
}

function getServer() {
  return Hapi.server({
    port: config.server.port,
  });
}

async function setupServer(server) {
  await registerPlugins(server);
  await setAuthStrategy(server);
  await registerRoutes(server);
}

async function registerPlugins(server) {
  await server.register([
    Blipp,
    Vision,
    Inert,
    HapiAuthJwt2,
    {
      plugin: HapiSwagger,
      options: {
        host: config.server.host,
        schemes: ['https', 'http'],
        info: {
          title: '카페테리아 서버 API',
          version: thisPackage.version,
        },
      },
    },
    {
      plugin: HapiGood,
      options: {
        includes: {
          request: ['headers', 'payload'],
          response: ['headers', 'payload'],
        },
        ops: {
          interval: config.log.ops.interval,
        },
        reporters: {
          eventReporter: [
            {
              module: '@hapi/good-squeeze', /* filter events */
              name: 'Squeeze',
              args: [{ops: '*', log: '*', response: '*', error: '*'}],
            },
            new LogTransform(),
          ],
        },
      },
    },
  ]);
}

function setAuthStrategy(server) {
  const validate = getValidator();

  server.auth.strategy('standard', 'jwt', {
    key: config.auth.key,
    validate: validate,
    verifyOptions: {algorithms: ['HS256'], expiresIn: config.auth.expiresIn},
  });
}

function getValidator() {
  const authenticator = resolve(Authenticator);

  return async (decoded, request, h) => {
    return authenticator.authenticateJwt(decoded);
  };
}

async function registerRoutes(server) {
  await server.register([
    // These must be dynamically(lazily) imported
    // because they will call resolver, which must
    // react with proper instance.
    ((await import('./routes/public')).default),
    ((await import('./routes/transaction')).default),
    ((await import('./routes/cafeteria')).default),
    ((await import('./routes/corners')).default),
    ((await import('./routes/menus')).default),
    ((await import('./routes/user')).default),
    ((await import('./routes/interaction')).default),
    ((await import('./routes/notices')).default),
    ((await import('./routes/appInfo')).default),
    ((await import('./routes/root')).default),
  ]);
}

export default createServer;
