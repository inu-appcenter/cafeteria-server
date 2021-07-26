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
import Boom from '@hapi/boom';

export default class LoginPolicyValidator {
  constructor(private readonly params: LoginParams) {}

  async validate() {
    const {studentId, password, rememberMeToken} = this.params;

    if (studentId && password) {
      await this.validateForPasswordLogin();
    } else if (studentId && rememberMeToken) {
      await this.validateForRememberedLogin();
    } else {
      throw Boom.badRequest(`학번과 비밀번호 또는 토큰이 필요합니다!`);
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

    assert(rememberMeToken, '토큰이 있어야 합니다!');

    const user = await User.findOne({where: {studentId}});

    assert(user, '사용자가 존재해야 합니다!');

    const hasValidToken = await compareBcryptHash(rememberMeToken, user.rememberMeToken);

    assert(hasValidToken, '토큰이 유효하지 않습니다!');
  }
}
