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
  assert(getEnv('SMS_API_KEY'), 'SMS API 키 설정해주세요!');
  assert(getEnv('SMS_API_SECRET'), 'SMS API 시크릿 설정해주세요!');
}

export default {
  isTest,
  isProduction,

  /**
   * 서버 운영에 필요한 설정입니다.
   */
  server: {
    host: getArg('host') || '0.0.0.0',
    port: getArg('port') || 9999,
    instanceName: getArg('instance-name') || '?',

    healthCheck: {
      rootHelloMessage:
        '안녕하세요 카페테리아 API 서버입니다. 지금 잘 작동하는 것 맞습니다. 혹시 이상 발생하면 010-2922-2661로 연락 주세요!',
      activeInstanceMessage: `활성 인스턴스: ${getArg('instance-name') || '?'}`,
    },

    jwt: {
      key: getEnv('JWT_SECRET_KEY', 'whatever haha'),
      expiresIn: '24h',
      cookieOptions: {
        encoding: 'none',
        secure: false,
        httpOnly: true,
        clearInvalid: true,
        strictHeader: true,
      },
      cookieName: 'cafeteria-server-session-token',
    },

    logging: {
      filepath: (name: string) => path.join(getArg('log-dir', 'logs'), name, `${name}-%DATE%.log`),
    },
  },

  /**
   * 애플리케이션 비즈니스 로직에 해당하는 설정입니다.
   */
  application: {
    question: {
      lengthLimit: 500,
    },

    transaction: {
      validation: {
        barcodeLifetimeMinutes: 10,
        barcodeTagMinimumIntervalSecs: 15,
      },
    },

    guestLogin: {
      challenge: {
        expiresIn: 60 * 5, // 초
      },
    },

    menu: {
      fetchIntervalMillis: 3600000, // 한 시간
      parser: {
        menuSplitterRegex: '-{8,}|\n{3,}', // (8개 이상의 -), 또는 (3개 이상의 개행문자).
      },
    },

    notify: {
      sender: '카페테리아 <cs-noreply@inu-cafeteria.app>',
      adminEmail: 'potados99@gmail.com',
    },
  },

  /**
   * 외부 인프라에 대한 설정입니다.
   */
  external: {
    aws: {
      region: 'ap-northeast-2',
      accessKeyId: getEnv('AWS_ACCESS_KEY_ID', 'an_aws_id'),
      secretAccessKey: getEnv('AWS_SECRET_ACCESS_KEY'),

      cloudwatch: {
        logGroupName: 'cafeteria-server',
      },
    },

    mail: {
      auth: {
        user: getEnv('SMTP_USERNAME'),
        pass: getEnv('SMTP_PASSWORD'),
      },
    },

    sms: {
      sender: '01029222661',
      auth: {
        key: getEnv('SMS_API_KEY'),
        secret: getEnv('SMS_API_SECRET'),
      },
    },

    inuLogin: {
      url: 'http://117.16.191.242:8081/login',
      key: getEnv('LOGIN_KEY', '앱센터는 모다?'),
      success: 'Y',
      fail: 'N',
    },

    uicoop: {
      homeUrl: 'https://www.uicoop.ac.kr',
      verifyUrl: 'https://www.uicoop.ac.kr/___verify',
      menuParsingUrl: 'https://www.uicoop.ac.kr/main.php?mkey=2&w=4',
    },
  },

  /**
   * 구형 클라이언트에 대한 지원을 위한 설정
   */
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
} as const;
