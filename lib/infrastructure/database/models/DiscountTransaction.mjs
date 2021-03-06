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

export default (sequelize, DataTypes) => {
  return sequelize.define('discount_transaction', {

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
     * No foreign key! It could not exist!
     */
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    /**
     * No foreign key! It could not exist!
     */
    cafeteria_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

  }, {
    // options
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  });
};
