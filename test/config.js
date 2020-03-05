/*
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020 INU Global Appcenter <potados99@gmail.com>
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

module.exports = {

  sequelize: {
    database: 'cafeteria', /* cafeteria */
    username: 'hah',
    password: 'duh',
    host: 'host', /* localhost */
    dialect: 'mysql', /* mysql */
    logging: false,
  },

  log: {
    ops: {
      interval: 60 * 1000, /* interval sampling ops event. */
    },
    file: {
      name: (name) => 'logs/test/test-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
    },
    timestamp: 'YYYY-MM-DD HH:mm:ss',
  },

  menu: {
    url: '0',
    fetchInterval: 0,
  },

};
