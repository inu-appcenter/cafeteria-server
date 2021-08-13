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

import UseCase from '../../common/base/UseCase';
import SMSSender from '../../external/sms/SMSSender';
import PhoneNumberValidator from './validation/PhoneNumberValidator';
import {GuestLoginChallenge} from '@inu-cafeteria/backend-core';
import {generateRandomDecimal} from '../../common/utils/random';

export type CreateGuestLoginChallengeParams = {
  phoneNumber: string;
};

class CreateGuestLoginChallenge extends UseCase<CreateGuestLoginChallengeParams, void> {
  async onExecute({phoneNumber}: CreateGuestLoginChallengeParams): Promise<void> {
    new PhoneNumberValidator(phoneNumber).validate();

    const passcode = generateRandomDecimal(4).toString(10);

    const challenge = await GuestLoginChallenge.create({
      phoneNumber,
      passcode,
    }).save();

    await this.sendChallenge(challenge);
  }

  private async sendChallenge({phoneNumber, passcode}: GuestLoginChallenge) {
    await new SMSSender({
      recipient: phoneNumber,
      body: `[카페테리아] 본인확인 인증번호는 [${passcode}] 입니다.`,
    }).send();
  }
}

export default new CreateGuestLoginChallenge();
