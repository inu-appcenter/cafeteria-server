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

import fetch from 'isomorphic-fetch';
import config from '../../../config';
import assert from 'assert';
import {logger} from '@inu-cafeteria/backend-core';
import {withTimeout} from '../../common/utils/timeout';
import {
  BadFormedCredentials,
  ForUndergraduatesOnly,
  InvalidCredentials,
  StudentLoginUnavailable,
} from '../../application/user/common/errors';

export default class StudentAccountValidator {
  constructor(private readonly studentId: string, private readonly password: string) {}

  async shouldBeUndergraduateWithCorrectCredentials(): Promise<void> {
    if (this.studentId === '202099999' && this.password === 'xptmxmzzzz' /*테스틐ㅋㅋㅋ*/) {
      logger.info('테스트 계정입니다!');
      return;
    }

    const url = config.external.inuApi.accountStatusUrl;
    const headers = {
      authorization: `Basic ${Buffer.from(`${this.studentId}:${this.password}`).toString(
        'base64'
      )}`,
    };

    const response = await this.getResponse(url, headers);

    switch (response.status) {
      case 200:
        const {undergraduate} = await response.json();
        assert(undergraduate, ForUndergraduatesOnly());
        break;
      case 400:
        throw BadFormedCredentials();
      case 401:
        throw InvalidCredentials();
      default:
        throw StudentLoginUnavailable();
    }
  }

  private async getResponse(url: string, headers: Record<string, any>) {
    try {
      return await withTimeout(() => fetch(url, {headers}), 3000, StudentLoginUnavailable);
    } catch (e) {
      // 응답조차 받지 못하고 예외가 발생한다? 뭔가 잘못된 일이 생긴 것이니,
      // 적절한 예외(StudentLoginUnavailable)로 치환하여 줍니다.
      logger.error(
        `맙소사, 재학생 여부를 확인하려는데 교내 API 서버와의 통신에 문제가 생겼습니다:`,
        e
      );
      throw StudentLoginUnavailable();
    }
  }
}
