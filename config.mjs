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

  if (!getEnv('AWS_ACCESS_KEY_ID')) throw new Error('AWS access id not set!');
  if (!getEnv('AWS_SECRET_ACCESS_KEY')) throw new Error('AWS secret access key id not set!');

  if (!getEnv('JWT_SECRET_KEY')) throw new Error('JWT secret key not set!');
  if (!getEnv('DB_USERNAME')) throw new Error('DB username not set!');
  if (!getEnv('DB_PASSWORD')) throw new Error('DB password not set!');
  if (!getEnv('LOGIN_KEY')) throw new Error('Login key not set!');
}

export default {

  server: {
    host: getArg('host'),
    port: getArg('port') || 9999,
    instanceName: getArg('instance-name') || '?',
    rootHelloMessage: '안녕하세요 카페테리아 API 서버입니다. 지금 잘 작동하는 것 맞습니다. 혹시 이상 발생하면 010-2922-2661로 연락 주세요!',
  },

  auth: {
    key: getEnv('JWT_SECRET_KEY', 'whatever'),
    expiresIn: '24h',
    cookieOptions: {
      encoding: 'none', // we already used JWT to encode
      isSecure: false, // https only?
      isHttpOnly: true, // prevent client alteration
      clearInvalid: true, // remove invalid cookies
      strictHeader: true, // don't allow violations of RFC 6265
    },
    cookieKey: 'cafeteria-server-session-token',
  },

  aws: {
    cloudwatch: {
      logGroupName: 'cafeteria-server',
    },
    region: 'ap-northeast-2',
    accessKeyId: getEnv('AWS_ACCESS_KEY_ID', 'an_aws_id'),
    secretAccessKey: getEnv('AWS_SECRET_ACCESS_KEY'),
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
    ops: {interval: 60 * 60 * 1000}, /* an hour, in millisecond */
    filepath: (name) => path.join(getArg('log-dir', 'logs'), name, `${name}-%DATE%.log`),
    securedPayloads: [
      'password',
      'token',
    ],
  },

  menu: {
    // Menu API
    url: 'https://www.uicoop.ac.kr/main.php?mkey=2&w=4',
    method: 'post',
    dateArgName: 'sdt',
    weekArgName: 'jun',
    fetchIntervalMillis: 3600000, // One hour
    parser: {
      menuSplitterRegex: '-{8,}|\n{3,}', // (8 or more of -), or (3 or more of newline).
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

  },

  mail: {
    sender: '카페테리아 <cs-noreply@inu-cafeteria.app>',
    auth: {
      user: getEnv('SMTP_USERNAME'),
      pass: getEnv('SMTP_PASSWORD'),
    },

    addresses: {
      admin: 'potados99@gmail.com',
    },
  },

  question: {
    lengthLimit: 500,
  },

  legacy: {
    isBarcode: {
      cafeCodeToCafeteriaId: {
        /* Cafe code : Newly given cafeteria id */
        1: 4, /* 제1 기숙사식당 */
        2: 3, /* 사범대식당 */
      },
    },
    pushNumber: {
      cafeCodeToCafeteriaId: {
        /* Cafe code : Newly given cafeteria id */
        1: 1, /* 학생식당 */
      },
    },
  },

  waiting: {
    orderTTL: {
      amount: 1,
      unit: 'hour',
    },
  },

};
