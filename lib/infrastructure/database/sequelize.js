/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020 INU Appcenter <potados99@gmail.com>
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

const Sequelize = require('sequelize');
const config = require('@config/config');

const sequelize = new Sequelize(
	config.sequelize.database,
	config.sequelize.username,
	config.sequelize.password,
	config.sequelize
);

const models = {
	DiscountTransaction: sequelize.import('./models/DiscountTransaction').
	Cafeteria: sequelize.import('./models/Cafeteria'),
	Corner: sequelize.import('./models/Corner'),
	User: sequelize.import('./models/User')
};

// Discount transactions belong to user.
// user ----* discount transaction
models.Transaction.belongsTo(models.User, { foreignKey: 'user_id' });

// Discount transactions also belog to a cafeteria.
// cafeteria ----* discount transaction.
models.Transaction.belongsTo(models.Cafeteria, { foreignKey: 'cafeteria_id' });

// Corner belong to a cafeteria.
// cafeteria ----* corner
models.Corner.belongsTo(models.Cafeteria, { foreignKey: 'cafeteria_id' });

module.exports = sequelize;
