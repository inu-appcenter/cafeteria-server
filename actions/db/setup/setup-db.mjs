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

import logger from '../../../lib/common/utils/logger.mjs';
import sequelize from '../../../lib/infrastructure/database/sequelize.mjs';
import initial from '../initial-db-contents.mjs';

/**
 * Sync & put initial rows to DB.
 * Rows will be updated on duplicate.
 *
 * @param force If force is true, each DAO will do DROP TABLE IF EXISTS ..., before it tries to create its own table
 * @param alter If alter is true, each DAO will do ALTER TABLE ... CHANGE ...
 *              Alters tables to fit models. Not recommended for production use. Deletes data in columns that were removed or had their type changed in the model.
 * @return {Promise<void>}
 */
export default async function setupDatabase(force=false, alter=false) {
  logger.info(`Sync sequelize(force: ${force}, alter: ${alter}).`);
  await sequelize.sync({force, alter});

  logger.info('Acquire models.');
  const cafeteriaModel = sequelize.model('cafeteria');
  const cornerModel = sequelize.model('corner');
  const cafeteriaValidationParamsModel = sequelize.model('cafeteria_validation_params');
  const cafeteriaDiscountRuleModel = sequelize.model('cafeteria_discount_rule');
  const parseRegexModel = sequelize.model('parse_regex');
  const appVersionRuleModel = sequelize.model('app_version_rule');
  const noticeModel = sequelize.model('notice');
  const userModel = sequelize.model('user');
  const questionModel = sequelize.model('question');
  const answerModel = sequelize.model('answer');
  const orderModel = sequelize.model('order');

  logger.info('Create cafeteria.');
  await cafeteriaModel.bulkCreate(initial.cafeteria, {
    updateOnDuplicate: Object.keys(cafeteriaModel.rawAttributes),
  });

  logger.info('Create corners.');
  await cornerModel.bulkCreate(initial.corners, {
    updateOnDuplicate: Object.keys(cornerModel.rawAttributes), // all keys need to be noted.
  });

  logger.info('Create validation params.');
  await cafeteriaValidationParamsModel.bulkCreate(initial.validationParams, {
    updateOnDuplicate: Object.keys(cafeteriaValidationParamsModel.rawAttributes),
  });

  logger.info('Create discount rule statuses.');
  await cafeteriaDiscountRuleModel.bulkCreate(initial.ruleStatuses, {
    updateOnDuplicate: Object.keys(cafeteriaModel.rawAttributes),
  });

  logger.info('Create parse regexes');
  await parseRegexModel.bulkCreate(initial.parseRegexes, {
    updateOnDuplicate: Object.keys(parseRegexModel.rawAttributes),
  });

  logger.info('Create app version rules');
  await appVersionRuleModel.bulkCreate(initial.appVersionRules, {
    updateOnDuplicate: Object.keys(appVersionRuleModel.rawAttributes),
  });

  logger.info('Create notices');
  await noticeModel.bulkCreate(initial.notices, {
    updateOnDuplicate: Object.keys(noticeModel.rawAttributes),
  });

  logger.info('Create users');
  await userModel.bulkCreate(initial.users, {
    updateOnDuplicate: Object.keys(userModel.rawAttributes),
  });

  logger.info('Create questions');
  await questionModel.bulkCreate(initial.questions, {
    updateOnDuplicate: Object.keys(questionModel.rawAttributes),
  });

  logger.info('Create answers');
  await answerModel.bulkCreate(initial.answers, {
    updateOnDuplicate: Object.keys(answerModel.rawAttributes),
  });

  logger.info('Create orders');
  await orderModel.bulkCreate(initial.orders, {
    updateOnDuplicate: Object.keys(orderModel.rawAttributes),
  });

  logger.info('Close sequelize.');
  await sequelize.close();
}
