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

    this.users = new Map();
  }

  getRemoteLoginResult(id, password) {
    return 'Y';
  }

  findUserById(id) {
    return this.users.get(id);
  }

  addOrUpdateUser(id, {token=null, barcode=null}) {
    this.users.set(id, new User({
      id: id,
      token: token,
      barcode: barcode,
    }));
  }

  updateLastLoginTimestamp(id) {
    logger.verbose('Timestamp updated!');
  }

  updateLastLogoutTimestamp(id) {
    logger.verbose('Timestamp updated!');
  }
}

export default UserRepositoryMock;
