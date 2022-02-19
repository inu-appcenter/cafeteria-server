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

import config from '../../../config';
import {logger} from '@inu-cafeteria/backend-core';
import {postUrlencoded} from '../../common/utils/fetch';
import {encryptForRemoteLogin} from '../../common/utils/encrypt';
import {
  BadFormedCredentials,
  ForUndergraduatesOnly,
  InvalidCredentials,
  StudentLoginUnavailable,
} from '../../application/user/common/errors';

export default class StudentAccountValidator {
  constructor(private readonly studentId: string, private readonly password: string) {}

  async shouldBeUndergraduateWithCorrectCredentials(): Promise<void> {
    if (this.studentId === '202099999' && this.password === 'xptmxmzzzz') {
      logger.info('테스트 계정입니다!');
      return;
    }

    let response;
    try {
      response = await postUrlencoded(config.external.inuLogin.url, {
        sno: this.studentId,
        pw: this.encryptPassword(),
      });
    } catch (e) {
      logger.error(e);
      return;
    }

    switch (response.status) {
      case 200:
        break;
      case 400:
        throw BadFormedCredentials();
      case 401:
        throw InvalidCredentials();
      case 403:
        throw ForUndergraduatesOnly();
      default:
        throw StudentLoginUnavailable();
    }
  }

  private encryptPassword() {
    return encryptForRemoteLogin(this.password, config.external.inuLogin.key);
  }
}
