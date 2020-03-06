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

'use strict';

import logger from './lib/common/utils/logger';

import sequelize from './lib/infrastructure/database/sequelize';

import createServer from './lib/infrastructure/webserver/server';

async function start() {
  // Sync DB.
  try {
    await sequelize.sync();

    logger.info('Connection to DB has been established successfully.');
  } catch (e) {
    logger.error('Unable to connect to the database: ' + e);
  }

  // Start server.
  try {
    const server = await createServer();
    await server.start();

    logger.info('Server running at: ' + server.info.uri);
  } catch (e) {
    sequelize.close();

    logger.error(e);
    process.exit(1);
  }
}

start();
