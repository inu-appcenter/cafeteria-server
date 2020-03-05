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
