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

import config from '../../../config';
import fetch from '../../common/utils/fetch';
import encrypt from '../../common/utils/encrypt';
import logger from '../../common/utils/logger';
import RemoteLoginResult from '../../domain/constants/RemoteLoginResult';
import UserDataSource from '../../domain/repositories/UserDataSource';
import getEnv from '../../common/utils/env';

class UserRemoteDataSource extends UserDataSource {
  async userExists(id) {
    return id !== getEnv('TEST_ID');
  }

  async fetchLoginResult(id, password) {
    try {
      return await fetch.postAndGetReponseText(
        config.login.url,
        {
          sno: id,
          pw: encrypt(password, config.login.key),
        },
      );
    } catch (e) {
      // Possibly a timeout
      logger.error(e);
      return RemoteLoginResult.FUCK;
    }
  }
}

export default UserRemoteDataSource;
