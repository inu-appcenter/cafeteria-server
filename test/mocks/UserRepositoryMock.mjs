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

/**
 * Serves default mock implementation for UserRepository.
 */
class UserRepositoryMock extends UserRepository {
  constructor() {
    super();
  }

  getRemoteLoginResult(id, password) {
    throw new Error('Not mocked! You need extra mock here');
  }

  findUserById(id) {
    if (id > 2100000000) {
      return null;
    }

    return new User({
      id: id,
      token: 'token',
      barcode: 'barcode',
    });
  }

  addOrUpdateUser(id, {token=null, barcode=null}) {
    // do nothing
  }

  updateLastLoginTimestamp(id) {
    // do nothing
  }

  updateLastLogoutTimestamp(id) {
    // do nothing
  }
}

export default UserRepositoryMock;
