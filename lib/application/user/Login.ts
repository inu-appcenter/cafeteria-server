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
import LoginPolicyValidator from './validation/LoginPolicyValidator';
import {Session} from './common/types';

export type LoginParams = {
  studentId: string;
  password?: string;
  rememberMeToken?: string;
};

class Login extends UseCase<LoginParams, Session> {
  async onExecute(params: LoginParams): Promise<Session> {
    await new LoginPolicyValidator(params).validate();

    return await this.updateUserAndCreateSession(params.studentId);
  }

  private async updateUserAndCreateSession(studentId: string): Promise<Session> {
    const user = await User.getOrCreate({studentId});
    const newRememberMeToken = generateUUID();
    const newBarcode = await GenerateBarcode.run({studentId});

    user.rememberMeToken = await applyBcryptHash(newRememberMeToken);
    user.lastLoginAt = new Date();
    user.barcode = newBarcode;

    await user.save();

    return {
      jwt: createJwt({userId: user.id}),
      rememberMeToken: newRememberMeToken,
      barcode: newBarcode,
    };
  }
}

export default new Login();
