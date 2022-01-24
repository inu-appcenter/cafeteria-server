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

import {User} from '@inu-cafeteria/backend-core';
import UseCase from '../../common/base/UseCase';
import {UserIdentifier} from '../user/common/types';

/**
 * 개인정보처리방침 동의가 필요한지 확인합니다.
 */
class CheckAgreementRequired extends UseCase<UserIdentifier, boolean> {
  async onExecute({userId}: UserIdentifier): Promise<boolean> {
    const user = await User.findOneOrFail(userId);

    return !user.hasAgreedPrivacyPolicy();
  }
}

export default new CheckAgreementRequired();
