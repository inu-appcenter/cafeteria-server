/**
 * This file is part of INU Cafeteria.
 *
 * Copyright 2021 INU Global App Center <potados99@gmail.com>
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

import assert from 'assert';
import {getEnv, getSecret} from '@inu-cafeteria/backend-core';

const isTest = getEnv('NODE_ENV') === 'test';
const isProduction = getEnv('NODE_ENV') === 'production';

if (isProduction) {
  assert(getEnv('PORT'), '포트 설정해주세요!');
  assert(getEnv('LOG_DIR'), '로그 경로 설정해주세요!');
  assert(getEnv('INSTANCE_NAME'), '인스턴스 이름을 설정해주세요!');

  assert(getSecret('JWT_SECRET_KEY'), 'JWT 비밀 key 설정해주세요!');
  assert(getSecret('LOGIN_KEY'), '로그인 key 설정해주세요!');
  assert(getSecret('AWS_ACCESS_KEY_ID'), 'AWS access id 설정해주세요!');
  assert(getSecret('AWS_SECRET_ACCESS_KEY'), 'AWS secret access key 설정해주세요!');
  assert(getSecret('DB_USERNAME'), 'DB 사용자 이름 설정해주세요!');
  assert(getSecret('DB_PASSWORD'), 'DB 비밀번호 설정해주세요!');
  assert(getSecret('SMTP_USERNAME'), 'SMTP 사용자 이름 설정해주세요!');
  assert(getSecret('SMTP_PASSWORD'), 'SMTP 비밀번호 설정해주세요!');
  assert(getSecret('SMS_API_KEY'), 'SMS API 키 설정해주세요!');
  assert(getSecret('SMS_API_SECRET'), 'SMS API 시크릿 설정해주세요!');
}

export default {
  isTest,
  isProduction,

  /**
   * 서버 운영에 필요한 설정입니다.
   */
  server: {
    port: getEnv('PORT') || 9999,
    instanceName: getEnv('INSTANCE_NAME') || '?',

    healthCheck: {
      activeInstanceMessage: `활성 인스턴스: ${getEnv('INSTANCE_NAME') || '?'}`,
    },

    jwt: {
      key: getSecret('JWT_SECRET_KEY', 'whatever haha'),
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
      directory: getEnv('LOG_DIR', 'logs'),
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
        barcodeLifeSpanMinutes: 10,
        barcodeTagMinimumIntervalSecs: 5,
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

    booking: {
      historyInHours: 72,
    },
  },

  /**
   * 외부 인프라에 대한 설정입니다.
   */
  external: {
    aws: {
      region: 'ap-northeast-2',
      accessKeyId: getSecret('AWS_ACCESS_KEY_ID', 'an_aws_id'),
      secretAccessKey: getSecret('AWS_SECRET_ACCESS_KEY'),

      cloudwatch: {
        logGroupName: 'cafeteria-server',
      },
    },

    mail: {
      auth: {
        user: getSecret('SMTP_USERNAME'),
        pass: getSecret('SMTP_PASSWORD'),
      },
    },

    sms: {
      sendUrl: 'https://api.coolsms.co.kr/messages/v4/send',
      sender: '0328359798',
      auth: {
        key: getSecret('SMS_API_KEY'),
        secret: getSecret('SMS_API_SECRET'),
      },
    },

    inuApi: {
      accountStatusUrl: (studentId: string, password: string) =>
        `http://api.inuappcenter.kr:8080/account/status?studentId=${studentId}&password=${password}`,
      key: getSecret('LOGIN_KEY', '앱센터는 모다?'),
    },

    uicoop: {
      homeUrl: 'https://inucoop.com',
      verifyUrl: 'https://inucoop.com/___verify',
      menuParsingUrl: 'https://inucoop.com/main.php?mkey=2&w=4',
    },

    calender: {
      holidays: {
        url: 'https://calendar.google.com/calendar/ical/ko.south_korea.official%23holiday%40group.v.calendar.google.com/public/basic.ics',
      },
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
