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
import UseCase from '../../common/base/UseCase';
import {Session} from './common/types';
import {generateUUID} from '../../common/utils/uuid';
import GenerateBarcode from '../barcode/GenerateBarcode';
import {User, createJwt} from '@inu-cafeteria/backend-core';
import {applyBcryptHash} from '../../common/utils/bcrypt';
import StudentLoginPolicyValidator from './validation/StudentLoginPolicyValidator';

export type StudentLoginParams = {
  studentId: string;
  password?: string;
  rememberMeToken?: string;
};

class StudentLogin extends UseCase<StudentLoginParams, Session> {
  async onExecute(params: StudentLoginParams): Promise<Session> {
    await new StudentLoginPolicyValidator(params).validate();

    return await this.updateUserAndCreateSession(params.studentId);
  }

  private async updateUserAndCreateSession(studentId: string): Promise<Session> {
    const user = await User.getOrCreate({studentId});
    const newRememberMeToken = generateUUID();
    const newBarcode = await GenerateBarcode.run({studentId});

    user.updateLoginStatus(await applyBcryptHash(newRememberMeToken), newBarcode);

    await user.save();

    const newJwt = createJwt({userId: user.id}, config.server.jwt.key, {
      expiresIn: config.server.jwt.expiresIn,
    });

    return {
      jwt: newJwt,
      rememberMeToken: newRememberMeToken,
      barcode: newBarcode,
    };
  }
}

export default new StudentLogin();
