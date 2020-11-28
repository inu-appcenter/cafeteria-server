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
import initial from './initial-db-contents';
import logger from '../lib/common/utils/logger';
import getArg from '../lib/common/utils/args';

async function doSetUp(force) {
  logger.info(`Sync sequelize(force: ${force}).`);
  await sequelize.sync({force});

  logger.info('Acquire models.');
  const cafeteriaModel = sequelize.model('cafeteria');
  const cornerModel = sequelize.model('corner');
  const cafeteriaValidationParamsModel = sequelize.model('cafeteria_validation_params');
  const cafeteriaDiscountRuleModel = sequelize.model('cafeteria_discount_rule');
  const parseRegexModel = sequelize.model('parse_regex');
  const appVersionRuleModel = sequelize.model('app_version_rule');

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

  logger.info('Close sequelize.');
  await sequelize.close();
}

doSetUp(getArg('force', false)).then(() => {
  console.log('Setup finished.');
});
