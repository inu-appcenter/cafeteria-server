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

import {User} from '@inu-cafeteria/backend-core';
import UseCase from '../../common/base/UseCase';
import {createJwt} from '../../common/utils/token';
import {generateUUID} from '../../common/utils/uuid';
import GenerateBarcode from '../barcode/GenerateBarcode';
import {applyBcryptHash} from '../../common/utils/bcrypt';
import LoginPolicyValidator from './LoginPolicyValidator';

export type LoginParams = {
  studentId: string;
  password?: string;
  rememberMeToken?: string;
};

export type LoginResult = {
  jwt: string;
  rememberMeToken: string;
};

class Login extends UseCase<LoginParams, LoginResult> {
  async onExecute(params: LoginParams): Promise<LoginResult> {
    await new LoginPolicyValidator(params).validate();

    return await this.updateUserAndCreateSession(params.studentId);
  }

  private async updateUserAndCreateSession(studentId: string) {
    const user = await this.getOrCreateUser(studentId);
    const newRememberMeToken = generateUUID();

    user.rememberMeToken = await applyBcryptHash(newRememberMeToken);
    user.lastLoginAt = new Date();
    user.barcode = await GenerateBarcode.run({studentId});

    await user.save();

    return {
      jwt: createJwt({userId: user.id}),
      rememberMeToken: newRememberMeToken,
    };
  }

  private async getOrCreateUser(studentId: string) {
    const userFound = await User.findOne({where: {studentId}});

    if (userFound) {
      return userFound;
    } else {
      return User.create({
        studentId,
      });
    }
  }
}

export default new Login();
