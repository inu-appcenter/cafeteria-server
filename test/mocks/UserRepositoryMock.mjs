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

import UserRepository from '../../lib/domain/repositories/UserRepository';
import User from '../../lib/domain/entities/User';

import logger from '../../lib/common/utils/logger';

class UserRepositoryMock extends UserRepository {
  constructor() {
    super();
    this.user = null;
  }

  getRemoteLoginResult(id, password) {
    return 'Y';
  }

  findUserById(id) {
    logger.verbose(`getting user of if ${id}`);

    return new User({
      id: id,
      token: 'my-remember-me-token',
      barcode: 'my-barcode',
    });
  }

  addOrUpdateUser(id, {token=null, barcode=null}) {
    logger.verbose(`update ${id}: (${token}, ${barcode})`);
  }

  updateLastLoginTimestamp(id) {
    logger.verbose('Timestamp updated!');
  }

  updateLastLogoutTimestamp(id) {
    logger.verbose('Timestamp updated!');
  }
}

export default UserRepositoryMock;
