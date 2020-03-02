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
  const discountTransactionModel = sequelize.define('discount_transaction', {

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

    meal_type: {/* 0 or 1 or 2 */
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    /* This will be added when inserting a new raw.
     * So it won't be used in domain.
     */
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    /**
     * And a foreign key 'user_id'
     */

    /**
      * And a foreign key 'cafeteria_id'
      */

  }, {
    // options
    timestamps: false,
  });

  discountTransactionModel.associate = (models) => {
    discountTransactionModel.belongsTo(
        models.User,
        {
          foreignKey: 'user_id',
        },
    );
    discountTransactionModel.belongsTo(
        models.User,
        {
          foreignKey: 'cafeteria_id',
        },
    );
  };

  return discountTransactionModel;
};
