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

import CafeteriaValidationParams from '../models/CafeteriaValidationParams';
import DiscountTransaction from '../models/DiscountTransaction';
import UserDiscountStatus from '../models/UserDiscountStatus';

import Cafeteria from '../models/Cafeteria';
import Corner from '../models/Corner';
import User from '../models/User';

import Feedback from '../models/Feedback';
import Notification from '../models/FeedbackReply';
import Notice from '../models/Notice';

import CafeteriaDiscountRule from '../models/CafeteriaDiscountRule';
import ParseRegex from '../models/ParseRegex';

import TransactionHistory from '../models/TransactionHistory';

import config from '../../../../config';
import logger from '../../../common/utils/logger';

// We need to import sequelize,
// which does not seems to be ready for ES6.
// So we need to destructure it after import.
//
// It seems that CommonJS module.exports
// does NOT give us named exports.
import seq from 'sequelize';

const {Sequelize, DataTypes} = seq;
import SequelizeMock from 'sequelize-mock';
import AppVersionRule from '../models/AppVersionRule';

export function createSequelizeInstance({mock = false}) {
  const sequelizeClass = mock ? SequelizeMock : Sequelize;
  const seqConfig = Object.assign({}, config.sequelize);

  if (seqConfig.logging) {
    seqConfig.logging = logger.verbose;
  }

  return new sequelizeClass(
    config.sequelize.database,
    config.sequelize.username,
    config.sequelize.password,
    seqConfig,
  );
}

export function registerModels(sequelizeInstance) {
  const models = {
    CafeteriaValidationParams: CafeteriaValidationParams(sequelizeInstance, DataTypes),
    DiscountTransaction: DiscountTransaction(sequelizeInstance, DataTypes),
    UserDiscountStatus: UserDiscountStatus(sequelizeInstance, DataTypes),
    CafeteriaDiscountRule: CafeteriaDiscountRule(sequelizeInstance, DataTypes),

    Cafeteria: Cafeteria(sequelizeInstance, DataTypes),
    Corner: Corner(sequelizeInstance, DataTypes),
    User: User(sequelizeInstance, DataTypes),

    Feedback: Feedback(sequelizeInstance, DataTypes),
    Notification: Notification(sequelizeInstance, DataTypes),
    Notice: Notice(sequelizeInstance, DataTypes),

    ParseRegex: ParseRegex(sequelizeInstance, DataTypes),
    TransactionHistory: TransactionHistory(sequelizeInstance, DataTypes),
    AppVersionRule: AppVersionRule(sequelizeInstance, DataTypes),
  };

  // Do associate.
  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });
}

