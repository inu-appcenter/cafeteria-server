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
import {encrypt} from '../../common/utils/cipher';
import {withTimeout} from '../../common/utils/timeout';
import {
  InvalidCredentials,
  BadFormedCredentials,
  ForUndergraduatesOnly,
  StudentLoginUnavailable,
} from '../../application/user/common/errors';

export default class StudentAccountValidator {
  constructor(private readonly studentId: string, private readonly password: string) {}

  async shouldBeUndergraduateWithCorrectCredentials(): Promise<void> {
    if (this.studentId === '202099999' && this.password === 'xptmxmzzzz') {
      logger.info('테스트 계정입니다!');
      return;
    }

    // TODO 9월 7일 아-주 급하게 잠시 모두 통과 처리하기로!
    logger.warn(`${this.studentId}씨는 지금 로그인 서버가 죽었기 때문에 일단 학생인걸로 합니다!`);
    return;

    const studentId = this.studentId;
    const password = this.encryptPassword();
    const url = config.external.inuApi.accountStatusUrl(studentId, password);

    const response = await withTimeout(() => fetch(url), 3000, StudentLoginUnavailable);

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

  private encryptPassword() {
    return encrypt(this.password, config.external.inuApi.key);
  }
}
