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

import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';
import HapiAuthJwt2 from 'hapi-auth-jwt2';
import config from '../../../config';
import thisPackage from '../../../package.json';
import validateUser from './middleware/validateUser';
import root from './routes/root';

export default async function startServer() {
  const server = await createServer();

  return server.start();
}

async function createServer() {
  const server = Hapi.server({
    host: config.server.host,
    port: config.server.port,
  });

  await registerPlugins(server);
  await setAuthStrategy(server);
  await registerRoutes(server);

  return server;
}

async function registerPlugins(server: Hapi.Server) {
  const auth = {
    plugin: HapiAuthJwt2,
  };

  const inert = {
    plugin: Inert, // Swagger UI 위해 필요함.
  };

  const vision = {
    plugin: Vision, // Swagger UI 위해 필요함.
  };

  const swagger = {
    plugin: HapiSwagger,
    options: {
      host: config.server.host,
      schemes: ['https', 'http'],
      info: {
        title: '카페테리아 서버 API',
        version: thisPackage.version,
      },
    },
  };

  await server.register([auth, inert, vision, swagger]);
}

function setAuthStrategy(server: Hapi.Server) {
  const jwtOptions = {
    key: config.auth.key,
    cookieKey: config.auth.cookieKey,
    validate: validateUser,
    verifyOptions: {algorithms: ['HS256'], expiresIn: config.auth.expiresIn},
  };

  server.auth.strategy('standard', 'jwt', jwtOptions);
  server.auth.default('standard');
}

function registerRoutes(server: Hapi.Server) {
  server.route([root]);
}
