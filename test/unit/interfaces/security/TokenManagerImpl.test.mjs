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

import TokenManagerImpl from '../../../../lib/interfaces/security/TokenManagerImpl';

import config from '../../../../config';

import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';

describe('# createJwt', () => {
  it('should work', async () => {
    const payload = {id: 1234};

    const newJwt = new TokenManagerImpl().createJwt(payload);

    const decoded = JWT.verify(newJwt, config.auth.key);

    expect(payload.id).toBe(decoded.id);
  });
});

describe('# createRememberMeToken', () => {
  it('should work', async () => {
    expect(await (new TokenManagerImpl().createRememberMeToken())).toBeTruthy();
  });
});

describe('# compareBcryptToken', () => {
  it('should fail', async () => {
    const plain = 'hello';
    const hashed = await bcrypt.hash('not hello', 8);

    expect(await (new TokenManagerImpl().compareBcryptToken(plain, hashed))).toBe(false);
  });

  it('should work', async () => {
    const plain = 'hello';
    const hashed = await bcrypt.hash(plain, 8);

    expect(await (new TokenManagerImpl().compareBcryptToken(plain, hashed))).toBe(true);
  });
});
