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
  const questionModel = sequelize.define('question', {

    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    device_info: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    version: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    /**
     * And a foreign key 'user_id'
     */

  }, {
    // options
    timestamps: true,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  });

  questionModel.associate = (models) => {
    questionModel.belongsTo(
      models.User,
      {
        foreignKey: {
          name: 'user_id',
          allowNull: true, /* users who has no account must be able to send a feedback. */
        },
      },
    );
  };

  return questionModel;
};
