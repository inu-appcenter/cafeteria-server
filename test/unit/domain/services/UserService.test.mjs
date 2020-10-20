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

import resolve, {initWithOverrides} from '../../../../lib/common/di/resolve';

import UserService from '../../../../lib/domain/services/UserService';
import LoginResults from '../../../../lib/domain/constants/LoginResults';
import LogoutResults from '../../../../lib/domain/constants/LogoutResults';
import modules from '../../../../lib/common/di/modules';
import UserRepositoryMock from '../../../mocks/UserRepositoryMock';
import UserRepository from '../../../../lib/domain/repositories/UserRepository';
import TokenManagerMock from '../../../mocks/TokenManagerMock';
import TokenManager from '../../../../lib/domain/security/TokenManager';
import BarcodeTransformerMock from '../../../mocks/BarcodeTransformerMock2';
import BarcodeTransformer from '../../../../lib/domain/security/BarcodeTransformer';

beforeEach(async () => {
  await initWithOverrides(modules, [
    {
      create: async (r) => new UserRepositoryMock(),
      as: UserRepository,
    },
    {
      create: async (r) => new TokenManagerMock(),
      as: TokenManager,
    },
    {
      create: async (r) => new BarcodeTransformerMock(),
      as: BarcodeTransformer,
    },
  ], true);
});

describe('# Login', () => {
  const loginTest = async function(id, token, password, expectation) {
    const actual = await resolve(UserService).login(id, token, password);

    expect(actual).toEqual(expectation);
  };

  it('should fail with null id', async () => {
    await loginTest(null, 'token', 'password', {result: LoginResults.FUCK});
  });

  it('should fail with null token and password', async () => {
    await loginTest(201701562, null, null, {result: LoginResults.FUCK});
  });

  it('should fail with wrong id and wrong token', async () => {
    await loginTest(982892389297, 'wrongToken', null,
      {result: LoginResults.WRONG_AUTH});
  });

  it('should fail with correct id and wrong token', async () => {
    await loginTest(201701562, 'wrongToken', null,
      {result: LoginResults.INVALID_TOKEN});
  });

  it('should fail with remote login result N', async () => {
    setRemoteLoginResultMock('N');

    await loginTest(201701562, null, 'password',
      {result: LoginResults.WRONG_AUTH});
  });

  it('should fail with unknown remote login result', async () => {
    setRemoteLoginResultMock('FUCK');

    await loginTest(201701562, null, 'password',
      {result: LoginResults.WRONG_AUTH});
  });

  it('should succeed with correct id and correct token', async () => {
    setCompareBcryptTokenMock();
    setCreateJwtMock('mocked-jwt');
    setCreateRememberMeMock('mocked-remember-me-token');

    await loginTest(201701562, 'token', null,
      {result: LoginResults.SUCCESS, rememberMeToken: 'mocked-remember-me-token', jwt: 'mocked-jwt'});
  });

  it('should succeed with correct id and correct password', async () => {
    setRemoteLoginResultMock('Y');
    setCreateJwtMock('mocked-jwt');
    setCreateRememberMeMock('mocked-remember-me-token');

    await loginTest(201701562, null, 'password',
      {result: LoginResults.SUCCESS, rememberMeToken: 'mocked-remember-me-token', jwt: 'mocked-jwt'});
  });
});

describe('# Logout', () => {
  const logoutTest = async function(id, expectation) {
    const actual = await resolve(UserService).logout(id);

    expect(actual).toEqual(expectation);
  };

  it('should fail with null id', async () => {
    await logoutTest(null, {result: LogoutResults.FUCK});
  });

  it('should fail with wrong id', async () => {
    await logoutTest(982498248998, {result: LogoutResults.USER_NOT_FOUND});
  });

  it('should succeed with correct id', async () => {
    await logoutTest(201701562, {result: LogoutResults.SUCCESS});
  });
});

const setRemoteLoginResultMock = function(result) {
  const mock = jest.fn(() => result);

  resolve(UserService).userRepository.getLoginResult = mock;

  return mock;
};

const setCreateJwtMock = function(jwt) {
  const mock = jest.fn((payload) => jwt);

  resolve(UserService).tokenManager.createJwt = mock;

  return mock;
};

const setCreateRememberMeMock = function(rememberMeToken) {
  const mock = jest.fn(() => rememberMeToken);

  resolve(UserService).tokenManager.createRememberMeToken = mock;

  return mock;
};

const setCompareBcryptTokenMock = function() {
  const mock = jest.fn((a, b) => a === b);

  resolve(UserService).tokenManager.compareBcryptToken = mock;

  return mock;
};


