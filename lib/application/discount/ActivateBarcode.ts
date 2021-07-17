/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020 INU Global App Center <potados99@gmail.com>
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
import {User} from '@inu-cafeteria/backend-core';
import {UserIdentifier} from '../user/UserTypes';

class ActivateBarcode extends UseCase<UserIdentifier, void> {
  async onExecute({userId}: UserIdentifier): Promise<void> {
    /**
     * 사용자가 없으면 뭐 딱히 업데이트하지 않습니다.
     */
    await User.update(userId, {barcodeActivatedAt: new Date()});
  }
}

export default new ActivateBarcode();
