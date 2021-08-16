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
import config from '../../../../config';
import {GuestLoginParams} from '../GuestLogin';
import {compareBcryptHash} from '../../../common/utils/bcrypt';
import {GuestLoginChallenge, User} from '@inu-cafeteria/backend-core';
import {MissingRequiredParameters} from '../../../common/errors/general';
import {InvalidPasscode, InvalidRememberMeToken, UserNotExist} from '../common/errors';

export default class GuestLoginPolicyValidator {
  constructor(private readonly params: GuestLoginParams) {}

  async validate() {
    const {phoneNumber, passcode, rememberMeToken} = this.params;

    assert(phoneNumber, MissingRequiredParameters());
    assert(passcode || rememberMeToken, MissingRequiredParameters());

    if (passcode) {
      await this.validateForPasscodeLogin();
    } else {
      await this.validateForRememberedLogin();
    }
  }

  private async validateForPasscodeLogin() {
    const {phoneNumber, passcode} = this.params;

    assert(passcode, MissingRequiredParameters());

    const challenge = await GuestLoginChallenge.findLastOneByPhoneNumberNotOlderThan(
      phoneNumber,
      config.application.guestLogin.challenge.expiresIn
    );

    assert(challenge, InvalidPasscode());

    // 챌린지는 재사용을 허용하지 않습니다.
    await challenge.remove();
  }

  private async validateForRememberedLogin() {
    const {phoneNumber, rememberMeToken} = this.params;

    assert(rememberMeToken, InvalidRememberMeToken());

    const user = await User.findOne({where: {phoneNumber}});

    assert(user, UserNotExist());

    const hasValidToken = await compareBcryptHash(rememberMeToken, user.rememberMeToken);

    assert(hasValidToken, InvalidRememberMeToken());
  }
}
