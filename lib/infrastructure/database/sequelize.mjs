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

import CafeteriaDiscountRule from './models/CafeteriaDiscountRule';
import DiscountTransaction from './models/DiscountTransaction';
import UserDiscountStatus from './models/UserDiscountStatus';

import Cafeteria from './models/Cafeteria';
import Corner from './models/Corner';
import User from './models/User';

import config from '../../../config';
import logger from '../../common/utils/logger';

// We need to import sequelize,
// which does not seems to be ready for ES6.
// So we need to destructure it after import.
//
// It seems that CommonJS module.exports
// does NOT give us named exports.
import seq from 'sequelize';
const {Sequelize, DataTypes} = seq;

const seqConfig = Object.assign({}, config.sequelize);

if (seqConfig.logging) {
  seqConfig.logging = logger.verbose;
}

const sequelize = new Sequelize(
    config.sequelize.database,
    config.sequelize.username,
    config.sequelize.password,
    seqConfig,
);

const models = {
  CafeteriaDiscountRule: CafeteriaDiscountRule(sequelize, DataTypes),
  DiscountTransaction: DiscountTransaction(sequelize, DataTypes),
  UserDiscountStatus: UserDiscountStatus(sequelize, DataTypes),

  Cafeteria: Cafeteria(sequelize, DataTypes),
  Corner: Corner(sequelize, DataTypes),
  User: User(sequelize, DataTypes),
};

// Do associate.
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export default sequelize;
