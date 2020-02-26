/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020  INU Appcenter <potados99@gmail.com>
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
const seqConfig = require('@config/seq-config');

const sequelize = new Sequelize(
	seqConfig.database,
	seqConfig.username,
	seqConfig.password,
	seqConfig
);

const models = {
	Cafeteria: sequelize.import('./models/Cafeteria'),
	Corner: sequelize.import('./models/Corner'),
	User: sequelize.import('./models/User')
};

// A corner belongs to a cafeteria.
// cafeteria ----* corner
models.Corner.belongsTo(models.Cafeteria, { foreignKey: 'cafeteria_id' });

module.exports = sequelize;
