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

if (process.env.NODE_ENV === 'production') {
  if (!process.env.PORT) throw new Error('Port not set!');
  if (!process.env.JWT_SECRET_KEY) throw new Error('JWT secret key not set!');
  if (!process.env.DB_USERNAME) throw new Error('DB username not set!');
  if (!process.env.DB_PASSWORD) throw new Error('DB password not set!');
  if (!process.env.LOGIN_KEY) throw new Error('Login key not set!');
}

export default {

  server: {
    port: process.env.PORT || 9999,
  },

  auth: {
    key: process.env.JWT_SECRET_KEY || 'whatever',
    cookie_options: {
      encoding: 'none', // we already used JWT to encode
      isSecure: false, // https only?
      isHttpOnly: true, // prevent client alteration
      clearInvalid: true, // remove invalid cookies
      strictHeader: true, // don't allow violations of RFC 6265
    },
  },

  sequelize: {
    database: 'cafeteria',
    username: process.env.DB_USERNAME || 'user',
    password: process.env.DB_PASSWORD || '1234',
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+09:00',
    logging: true,
  },

  login: {
    // Remote login server
    url: 'http://117.16.191.242:8081/login',
    key: process.env.LOGIN_KEY || 'nothing',
    success: 'Y',
    fail: 'N',
  },

  log: {
    ops: {interval: 60 * 60 * 1000},
    filepath: (name) => 'logs/' + name + '/' + name + '-%DATE%.log',
  },

  menu: {
    // Menu API
    url: 'https://sc.inu.ac.kr/inumportal/main/info/life/foodmenuSearch',
    fetchInterval: 3600000, /* millis */
  },

  hash: {
    // bcrypt
    saltRounds: 9,
  },

};
