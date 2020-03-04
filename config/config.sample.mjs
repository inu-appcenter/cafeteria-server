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

/**
 * Copy this file to a same directory with name 'config.mjs'.
 */

module.exports = {

  // Server settings.
  // Used in lib/infrastructure/webserver/server.
  server: {
    port: 9999,
  },

  // Logging settings.
  log: {
    ops: {
      interval: 60 * 1000, /* interval sampling ops event. */
    },
    file: {
      name: (name) => 'logs/' + name + '/' + name + '-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
    },
    timestamp: 'YYYY-MM-DD HH:mm:ss',
  },

  // Auth settings.
  // Used in lib/infrastructure/webserver/server.
  auth: {
    key: 'blahblah',
    cookie_options: {
      ttl: 365 * 24 * 60 * 60 * 1000, // expires a year from today
      encoding: 'none', // we already used JWT to encode
      isSecure: false, // warm & fuzzy feelings
      isHttpOnly: true, // prevent client alteration
      clearInvalid: false, // remove invalid cookies
      strictHeader: true, // don't allow violations of RFC 6265
    },
  },

  // DB connection settings.
  // Used in lib/infrastructure/database/sequelize.
  sequelize: {
    database: '', /* cafeteria */
    username: '',
    password: '',
    host: '', /* localhost */
    dialect: '', /* mysql */
    logging: false,
  },

  // Login server settings.
  // Used in lib/interfaces/storage/UserRepositoryImpl.
  login: {
    url: 'http://117.16.191.242:8081/login',
    key: '', /* Appcenter The Greatest. */
    success: 'Y',
    fail: 'N',
  },

  // Food menu server settings.
  // Used in lib/interfaces/storage/CafeteriaRepositoryImpl.
  menu: {
    url: 'https://sc.inu.ac.kr/inumportal/main/info/life/foodmenuSearch',
    fetchInterval: 3600000, /* millis */
  },

  // bcrypt setting.
  // Used in lib/interfaces/validator/DiscountTransactionValidator.
  hash: {
    saltRounds: 10,
  },

};
