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

import {LoginParams} from './Login';
import StudentAccountValidator from '../../external/inu/StudentAccountValidator';
import {User} from '@inu-cafeteria/backend-core';
import {compareBcryptHash} from '../../common/utils/bcrypt';
import assert from 'assert';
import {InvalidRememberMeToken, StupidInvalid, UserNotExist} from './common/Errors';

export default class LoginPolicyValidator {
  constructor(private readonly params: LoginParams) {}

  async validate() {
    const {studentId, password, rememberMeToken} = this.params;

    assert(studentId, '학번이 필요합니다!');
    assert(password || rememberMeToken, '비밀번호 또는 자동로그인 토큰이 필요합니다!');

    if (password) {
      await this.validateForPasswordLogin();
    } else {
      await this.validateForRememberedLogin();
    }
  }

  private async validateForPasswordLogin() {
    const {studentId, password} = this.params;

    assert(password, '비밀번호가 있어야 합니다!');

    const isStudent = await new StudentAccountValidator(studentId, password).isStudent();

    assert(isStudent, '재학생 전용입니다!');
  }

  private async validateForRememberedLogin() {
    const {studentId, rememberMeToken} = this.params;

    assert(rememberMeToken, InvalidRememberMeToken());

    const user = await User.findOne({where: {studentId}});

    assert(user, UserNotExist());

    const hasValidToken = await compareBcryptHash(rememberMeToken, user.rememberMeToken);

    assert(hasValidToken, StupidInvalid());
  }
}
