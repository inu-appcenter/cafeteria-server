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

import assert from 'assert';
import config from '../../../config';
import {postUrlencoded} from '../../common/utils/fetch';
import {encryptForRemoteLogin} from '../../common/utils/encrypt';
import logger from '../../common/logging/logger';

export default class StudentAccountValidator {
  constructor(private readonly studentId: string, private readonly password: string) {}

  async isStudent(): Promise<boolean> {
    if (this.studentId === '202099999' && this.password === 'xptmxmzzzz') {
      logger.info('테스트 계정입니다!');
      return true;
    }

    const response = await postUrlencoded(config.external.inuLogin.url, {
      sno: this.studentId,
      pw: this.encryptPassword(),
    });

    assert(
      response === config.external.inuLogin.success || response === config.external.inuLogin.fail,
      `원격 로그인 응답은 ${config.external.inuLogin.success} 또는 ${config.external.inuLogin.fail} 중 하나만!`
    );

    return response === config.external.inuLogin.success;
  }

  private encryptPassword() {
    return encryptForRemoteLogin(this.password, config.external.inuLogin.key);
  }
}
