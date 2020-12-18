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

import sequelize from '../lib/infrastructure/database/sequelize';
import logger from '../lib/common/utils/logger';
import getArg from '../lib/common/utils/args';

/**
 * Sync database with Sequelize models.
 *
 * @param force If force is true, each DAO will do DROP TABLE IF EXISTS ..., before it tries to create its own table
 * @param alter If alter is true, each DAO will do ALTER TABLE ... CHANGE ...
 *              Alters tables to fit models. Not recommended for production use. Deletes data in columns that were removed or had their type changed in the model.
 * @return {Promise<void>}
 */
async function doSync(force, alter) {
  logger.info(`Sync sequelize(force: ${force}, alter: ${alter}).`);
  await sequelize.sync({force, alter});

  logger.info('Close sequelize.');
  await sequelize.close();
}

doSync(
  getArg('force', false),
  getArg('alter', false),
).then(() => {
  logger.info('Sync finished.');
});
