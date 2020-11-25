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

import logger from './lib/common/utils/logger';

import {init} from './lib/common/di/resolve';
import modules from './lib/common/di/modules';

import sequelize from './lib/infrastructure/database/sequelize';

import createServer from './lib/infrastructure/webserver/server';
import getEnv from './lib/common/utils/env';
import getArg from './lib/common/utils/args';

async function start() {
  logger.info(`NODE_ENV: ${getEnv('NODE_ENV', 'not set')}`);
  logger.info(`Logs saved in '${getArg('log-dir', 'logs')}'.`);

  // Instantiate all.
  try {
    await init(modules, false, false);

    logger.info('Resolver initialized.');
  } catch (e) {
    logger.error(e);
  }

  // Sync DB.
  try {
    await sequelize.sync();

    logger.info('Connection to DB has been established successfully.');
  } catch (e) {
    logger.error(e);
  }

  // Start server.
  try {
    const server = await createServer();
    await server.start();

    logger.info('Server running at: ' + server.info.uri);
  } catch (e) {
    sequelize.close();

    logger.error(e);
    process.exit(3);
  }
}

start();
