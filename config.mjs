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

import getArg from './lib/common/utils/args';
import getEnv from './lib/common/utils/env';
import path from 'path';

if (getEnv('NODE_ENV') === 'production') {
  if (!getArg('host')) throw new Error('Host not set!');
  if (!getArg('port')) throw new Error('Port not set!');
  if (!getArg('log-dir')) throw new Error('Log directory not set!');

  if (!getEnv('JWT_SECRET_KEY')) throw new Error('JWT secret key not set!');
  if (!getEnv('DB_USERNAME')) throw new Error('DB username not set!');
  if (!getEnv('DB_PASSWORD')) throw new Error('DB password not set!');
  if (!getEnv('LOGIN_KEY')) throw new Error('Login key not set!');
}

export default {

  server: {
    host: getArg('host'),
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
    username: getEnv('DB_USERNAME', 'potados'),
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
    url: 'https://www.uicoop.ac.kr/main.php?mkey=2&w=4',
    method: 'post',
    dateArgName: 'sdt',
    weekArgName: 'jun',
    fetchIntervalMillis: 3600000, // One hour
    parser: {
      priceAndCalorieRegex: [
        // These expressions represent a price-and-calorie part.
        // Any string matching this expressions will not be included in menu.
        // Therefore these should only capture the price-and-calorie part.
        '(?<PRICE>[0-9,]+)원/(?<CAL>[0-9,]+)[Kk]cal', // 5,500원/850Kcal
        '(?<PRICE>[0-9,]+)원[\n ](?<CAL>[0-9,]+)[Kk]cal', // 3500원 350kcal
        '(?<PRICE>[0-9,]+)원[\n ](?<CAL>[0-9,]+)[Kk]cal[\n ](?<CAL2>[0-9,]+)[Kk]cal', // 3500원 355kcal 390kcal
        '(?<PRICE>[0-9,]+)원/(?<PRICE2>[0-9,]+)원[\n ](?<CAL>[0-9,]+)[Kk]cal/(?<CAL2>[0-9,]+)[Kk]cal', // 3500원/4700원\n355kcal/390kcal
        '(?<PRICE>[0-9,]+)원[\n ](?<CAL>[0-9,]+)[Kk]cal/(?<CAL2>[0-9,]+)[Kk]cal', // 3500원\n355kcal/390kcal
        '(?<PRICE>[0-9,]+)~(?<PRICE2>[0-9,]+)원[\n ].+[0-9,]+원', // 2,000원~2500원\n+토핑500원,
        '(?<PRICE>[0-9,]+)원', // [부추+양파절임+김치+밥]5,500원
      ],
      menuSplitterRegex: '-{8,}',
    },
  },

  uicoop: {
    domain: 'https://www.uicoop.ac.kr',
    verifyUrl: 'https://www.uicoop.ac.kr/___verify',
  },

  hash: {
    // bcrypt
    saltRounds: 9,
  },

  transaction: {
    barcodeLifetimeMinutes: 10,
    barcodeTagMinimumIntervalSecs: 15,
    oldApiIdToCafeteriaId: {
      /* Code used by ol APIs : Newly given cafeteria id */
      1: 4, /* 제1 기숙사식당 */
      2: 3, /* 사범대식당 */
    },
  },
};
