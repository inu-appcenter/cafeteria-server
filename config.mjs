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

import path from 'path';
import getArg from './lib/common/utils/args';
import getEnv from './lib/common/utils/env';

if (getEnv('NODE_ENV') === 'production') {
  if (!getArg('port')) throw new Error('Port not set!');
  if (!getArg('log-dir')) throw new Error('Log directory not set!');

  if (!getEnv('JWT_SECRET_KEY')) throw new Error('JWT secret key not set!');
  if (!getEnv('DB_USERNAME')) throw new Error('DB username not set!');
  if (!getEnv('DB_PASSWORD')) throw new Error('DB password not set!');
  if (!getEnv('LOGIN_KEY')) throw new Error('Login key not set!');
}

export default {

  server: {
    port: getArg('port') || 8080,
  },

  auth: {
    key: getEnv('JWT_SECRET_KEY', 'whatever'),
    expiresIn: '24h',
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
    username: getEnv('DB_USERNAME', 'user'),
    password: getEnv('DB_PASSWORD', '1234'),
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+09:00',
    logging: false,
  },

  login: {
    // Remote login server
    url: 'http://117.16.191.242:8081/login',
    key: getEnv('LOGIN_KEY', 'nothing'),
    success: 'Y',
    fail: 'N',
  },

  log: {
    ops: {interval: 60 * 60 * 1000},
    filepath: (name) => path.join(getArg('log-dir', 'logs'), name, `${name}-%DATE%.log`),
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

  cornerMenuKeys: [
    {id: 1, TYPE1: 1, TYPE2: 0, FOODMENU_TYPE: 1},
    {id: 2, TYPE1: 2, TYPE2: 0, FOODMENU_TYPE: 1},
    {id: 3, TYPE1: 3, TYPE2: 0, FOODMENU_TYPE: 1},
    {id: 4, TYPE1: 4, TYPE2: 0, FOODMENU_TYPE: 1},
    {id: 5, TYPE1: 5, TYPE2: 0, FOODMENU_TYPE: 1},
    {id: 6, TYPE1: 6, TYPE2: 0, FOODMENU_TYPE: 1},
    {id: 7, TYPE1: 7, TYPE2: 0, FOODMENU_TYPE: 1},
    {id: 8, TYPE1: 8, TYPE2: 0, FOODMENU_TYPE: 1},

    {id: 9, TYPE1: -1, TYPE2: -1, FOODMENU_TYPE: 2},
    {id: 10, TYPE1: -1, TYPE2: -1, FOODMENU_TYPE: 2},
    {id: 11, TYPE1: -1, TYPE2: -1, FOODMENU_TYPE: 2},

    {id: 12, TYPE1: 1, TYPE2: 2, FOODMENU_TYPE: 3},
    {id: 13, TYPE1: 1, TYPE2: 3, FOODMENU_TYPE: 3},

    {id: 14, TYPE1: -1, TYPE2: -1, FOODMENU_TYPE: 4},
    {id: 15, TYPE1: -1, TYPE2: -1, FOODMENU_TYPE: 4},
    {id: 16, TYPE1: -1, TYPE2: -1, FOODMENU_TYPE: 4},

    {id: 17, TYPE1: 1, TYPE2: 2, FOODMENU_TYPE: 5},
    {id: 18, TYPE1: 1, TYPE2: 3, FOODMENU_TYPE: 5},
  ],

  transaction: {
    barcodeLifetimeMinutes: 10,
    barcodeTagMinimumIntervalSecs: 15,
  },

};
