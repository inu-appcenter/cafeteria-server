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

module.exports = (sequelize, DataTypes) => {

	return sequelize.define('user', {

		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		token: {
			type: DataTypes.STRING,
			allowNull: true
		},
		barcode: {
			type: DataTypes.STRING,
			allowNull: true
		},
		last_barcode_activation: {
			type: DataTypes.DATE,
			allowNull: true
		},
		last_barcode_tag: {
			type: DataTypes.DATE,
			allowNull: true
		},
		last_login: {
			type: DataTypes.DATE,
			allowNull: true
		},
		last_logout: {
			type: DataTypes.DATE,
			allowNull: true
		}

	}, {
		// options
		timestamps: false
	});

};
