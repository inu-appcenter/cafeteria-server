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

import TokenManager from '../../domain/security/TokenManager';

import config from '../../../config';

import randToken from 'rand-token';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';

class TokenManagerImpl extends TokenManager {
   createJwt(payload) {
    return JWT.sign(
      payload,
      config.auth.key,
      {algorithm: 'HS256', expiresIn: config.auth.expiresIn});
  }

  async createRememberMeToken() {
    return randToken.generate(20);
  }

  async compareBcryptToken(plain, hashed) {
    return await bcrypt.compare(plain, hashed);
  }

  async applyHash(plain) {
    return await bcrypt.hash(plain, config.hash.saltRounds);
  }
}

export default TokenManagerImpl;
