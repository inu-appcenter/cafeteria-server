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
import {User} from '@inu-cafeteria/backend-core';
import {compareBcryptHash} from '../../../common/utils/bcrypt';
import {StudentLoginParams} from '../StudentLogin';
import StudentAccountValidator from '../../../external/inu/StudentAccountValidator';
import {MissingRequiredParameters} from '../../../common/errors/general';
import {ForStudentsOnly, InvalidRememberMeToken, UserNotExist} from '../common/errors';

export default class StudentLoginPolicyValidator {
  constructor(private readonly params: StudentLoginParams) {}

  async validate() {
    const {studentId, password, rememberMeToken} = this.params;

    assert(studentId, MissingRequiredParameters());
    assert(password || rememberMeToken, MissingRequiredParameters());

    if (password) {
      await this.validateForPasswordLogin();
    } else {
      await this.validateForRememberedLogin();
    }
  }

  private async validateForPasswordLogin() {
    const {studentId, password} = this.params;

    assert(password, MissingRequiredParameters());

    const isStudent = await new StudentAccountValidator(studentId, password).isStudent();

    assert(isStudent, ForStudentsOnly());
  }

  private async validateForRememberedLogin() {
    const {studentId, rememberMeToken} = this.params;

    assert(rememberMeToken, InvalidRememberMeToken());

    const user = await User.findOne({where: {studentId}});

    assert(user, UserNotExist());

    const hasValidToken = await compareBcryptHash(rememberMeToken, user.rememberMeToken);

    assert(hasValidToken, InvalidRememberMeToken());
  }
}
