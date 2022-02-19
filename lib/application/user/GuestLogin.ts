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

import UseCase from '../../common/base/UseCase';
import {Session} from './common/types';
import {generateUUID} from '../../common/utils/uuid';
import {User, createJwt} from '@inu-cafeteria/backend-core';
import {applyBcryptHash} from '../../common/utils/bcrypt';
import GuestLoginPolicyValidator from './validation/GuestLoginPolicyValidator';
import config from '../../../config';

export type GuestLoginParams = {
  phoneNumber: string;
  passcode?: string;
  rememberMeToken?: string;
};

class GuestLogin extends UseCase<GuestLoginParams, Session> {
  async onExecute(params: GuestLoginParams): Promise<Session> {
    await new GuestLoginPolicyValidator(params).validate();

    return await this.updateUserAndCreateSession(params.phoneNumber);
  }

  private async updateUserAndCreateSession(phoneNumber: string): Promise<Session> {
    const user = await User.getOrCreate({phoneNumber});
    const newRememberMeToken = generateUUID();

    user.updateLoginStatus(await applyBcryptHash(newRememberMeToken));

    await user.save();

    const newJwt = createJwt({userId: user.id}, config.server.jwt.key, {
      expiresIn: config.server.jwt.expiresIn,
    });

    return {
      jwt: newJwt,
      rememberMeToken: newRememberMeToken,
    };
  }
}

export default new GuestLogin();
