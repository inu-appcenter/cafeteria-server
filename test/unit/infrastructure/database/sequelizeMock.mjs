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

import config from '../../../../config';

import SequelizeMock from 'sequelize-mock';

import CafeteriaValidationParams from '../../../../lib/infrastructure/database/models/CafeteriaValidationParams';
import DiscountTransaction from '../../../../lib/infrastructure/database/models/DiscountTransaction';
import UserDiscountStatus from '../../../../lib/infrastructure/database/models/UserDiscountStatus';
import Cafeteria from '../../../../lib/infrastructure/database/models/Cafeteria';
import Corner from '../../../../lib/infrastructure/database/models/Corner';
import User from '../../../../lib/infrastructure/database/models/User';
import Feedback from '../../../../lib/infrastructure/database/models/Feedback';
import Notification from '../../../../lib/infrastructure/database/models/FeedbackReply';
import Notice from '../../../../lib/infrastructure/database/models/Notice';
import CafeteriaDiscountRule from '../../../../lib/infrastructure/database/models/CafeteriaDiscountRule';
import ParseRegex from '../../../../lib/infrastructure/database/models/ParseRegex';

import seq from 'sequelize';
import TransactionHistory from '../../../../lib/infrastructure/database/models/TransactionHistory';
const {DataTypes} = seq;

const seqConfig = Object.assign({}, config.sequelize);

const sequelize = new SequelizeMock(
  config.sequelize.database,
  config.sequelize.username,
  config.sequelize.password,
  seqConfig,
);

const models = {
  CafeteriaValidationParams: CafeteriaValidationParams(sequelize, DataTypes),
  DiscountTransaction: DiscountTransaction(sequelize, DataTypes),
  UserDiscountStatus: UserDiscountStatus(sequelize, DataTypes),
  CafeteriaDiscountRule: CafeteriaDiscountRule(sequelize, DataTypes),

  Cafeteria: Cafeteria(sequelize, DataTypes),
  Corner: Corner(sequelize, DataTypes),
  User: User(sequelize, DataTypes),

  Feedback: Feedback(sequelize, DataTypes),
  Notification: Notification(sequelize, DataTypes),
  Notice: Notice(sequelize, DataTypes),

  ParseRegex: ParseRegex(sequelize, DataTypes),
  TransactionHistory: TransactionHistory(sequelize, DataTypes),
};

// Do associate.
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }

  // sequelize-mock has no findByPk. Therefore we add a proxy.
  models[modelName].findByPk = (key) => models[modelName].findById(key);
});

export default sequelize;
