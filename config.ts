/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2021 INU Global App Center <potados99@gmail.com>
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
import assert from 'assert';

const isTest = getEnv('NODE_ENV') === 'test';
const isProduction = getEnv('NODE_ENV') === 'production';

if (isProduction) {
  assert(getArg('host'), '호스트(host) 설정해주세요!');
  assert(getArg('port'), '포트(port) 설정해주세요!');
  assert(getArg('log-dir'), '로그 경로(log-dir) 설정해주세요!');

  assert(getEnv('JWT_SECRET_KEY'), 'JWT 비밀 key 설정해주세요!');
  assert(getEnv('LOGIN_KEY'), '로그인 key 설정해주세요!');
  assert(getEnv('AWS_ACCESS_KEY_ID'), 'AWS access id 설정해주세요!');
  assert(getEnv('AWS_SECRET_ACCESS_KEY'), 'AWS secret access key 설정해주세요!');
  assert(getEnv('DB_USERNAME'), 'DB 사용자 이름 설정해주세요!');
  assert(getEnv('DB_PASSWORD'), 'DB 비밀번호 설정해주세요!');
  assert(getEnv('SMTP_USERNAME'), 'SMTP 사용자 이름 설정해주세요!');
  assert(getEnv('SMTP_PASSWORD'), 'STMP 비밀번호 설정해주세요!');
}

export default {
  isTest,
  isProduction,

  server: {
    host: getArg('host') || '0.0.0.0',
    port: getArg('port') || 9999,
    instanceName: getArg('instance-name') || '?',
    rootHelloMessage:
      '안녕하세요 카페테리아 API 서버입니다. 지금 잘 작동하는 것 맞습니다. 혹시 이상 발생하면 010-2922-2661로 연락 주세요!',
    activeInstanceMessage: `활성 인스턴스: ${getArg('instance-name') || '?'}`,
  },

  auth: {
    key: getEnv('JWT_SECRET_KEY', 'whatever haha'),
    expiresIn: '24h',
    cookieOptions: {
      encoding: 'none',
      isSecure: false,
      isHttpOnly: true,
      clearInvalid: true,
      strictHeader: true,
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

  login: {
    // 재학생 확인용 원격 로그인 서버
    url: 'http://117.16.191.242:8081/login',
    key: getEnv('LOGIN_KEY', '앱센터는 모다?'),
    success: 'Y',
    fail: 'N',
  },

  log: {
    ops: {interval: 60 * 60 * 1000} /* 한 시간(밀리초로 나타냄) */,
    filepath: (name: string) => path.join(getArg('log-dir', 'logs'), name, `${name}-%DATE%.log`),
    securedPayloads: ['password', 'token'],
  },

  menu: {
    // 생협 식단 정보 페이지
    url: 'https://www.uicoop.ac.kr/main.php?mkey=2&w=4',
    method: 'post',
    dateArgName: 'sdt',
    weekArgName: 'jun',
    fetchIntervalMillis: 3600000, // 한 시간
    parser: {
      menuSplitterRegex: '-{8,}|\n{3,}', // (8개 이상의 -), 또는 (3개 이상의 개행문자).
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
    validation: {
      barcodeLifetimeMinutes: 10,
      barcodeTagMinimumIntervalSecs: 15,
    },
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
        /* 기존의 cafe code를 cafeteriaId로 변환 */
        1: 4 /* 제1 기숙사식당 */,
        2: 3 /* 사범대식당 */,
      },
    },
    pushNumber: {
      cafeCodeToCafeteriaId: {
        /* 기존의 cafe code를 cafeteriaId로 변환 */
        1: 1 /* 학생식당 */,
      },
    },
  },

  waiting: {
    orderTTL: {
      amount: 1,
      unit: 'hour',
    },
  },
} as const;
