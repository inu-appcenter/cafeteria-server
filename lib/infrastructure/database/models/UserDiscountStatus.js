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
  const userDiscountStatusModel = sequelize.define('user_discount_status', {

    /**
      * This field won't be used in domain.
      * It is only for to specify a row in a table.
      */
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    last_barcode_activation: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    last_barcode_tagging: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    /**
     * And a foreign key 'user_id'
     */

  }, {
    // options
    timestamps: false,
  });

  userDiscountStatusModel.associate = (models) => {
    userDiscountStatusModel.belongsTo(
        models.User,
        {
          foreignKey: 'user_id',
        },
    );
  };

  return userDiscountStatusModel;
};
