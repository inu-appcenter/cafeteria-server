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

import UserRepositoryImpl from '../../../../lib/interfaces/storage/UserRepositoryImpl';
import sequelize from '../../infrastructure/database/sequelizeMock';
import RemoteLoginResult from '../../../../lib/domain/constants/RemoteLoginResult';
import UserDataSource from '../../../../lib/domain/repositories/UserDataSource';

describe('# getRemoteLoginResult', () => {
  it('should catch null id or password', async () => {
    const repo = getRepository();
    const result = await repo.getLoginResult(null, null);

    expect(result).toBe(RemoteLoginResult.FUCK);
  });

  it('should fail with wrong auth', async () => {
    const repo = getRepository();
    const result = await repo.getLoginResult(3543534242, 'hehe');

    expect(result).toBe(RemoteLoginResult.FAIL);
  });

  it('should succeed', async () => {
    const repo = getRepository();
    const result = await repo.getLoginResult(201701562, 'password');

    expect(result).toBe(RemoteLoginResult.SUCCESS);
  });
});

describe('# findUserById', () => {
  it('should catch null id', async () => {
    const repo = getRepository();
    const result = await repo.findUserById(null);

    expect(result).toBeNull();
  });

  it('should succeed', async () => {
    const repo = getRepository();
    const result = await repo.findUserById(201701562);

    expect(result).toHaveProperty('id', 201701562);
    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('barcode');
  });
});

describe('# addOrUpdateUser', () => {
  it('should catch null id', async () => {
    const repo = getRepository();

    const upsertMock = jest.fn();
    sequelize.model('user').upsert = upsertMock;

    await repo.addOrUpdateUser(null, {});

    expect(upsertMock).toBeCalledTimes(0);
  });

  it('should succeed', async () => {
    const repo = getRepository();

    const upsertMock = jest.fn();
    sequelize.model('user').upsert = upsertMock;

    await repo.addOrUpdateUser(201701562, {token: 'token', barcode: 'barcode'});

    expect(upsertMock).toBeCalledTimes(1);
    expect(upsertMock).toBeCalledWith({id: 201701562, token: 'token', barcode: 'barcode'});
  });
});

describe('# updateLastLoginTimestamp', () => {
  it('should succeed', async () => {
    const repo = getRepository();

    const upsertMock = jest.fn();
    sequelize.model('user').upsert = upsertMock;

    await repo.updateLastLoginTimestamp(201701562);

    expect(upsertMock).toBeCalledTimes(1);
  });
});

describe('# updateLastLogoutTimestamp', () => {
  it('should succeed', async () => {
    const repo = getRepository();

    const upsertMock = jest.fn();
    sequelize.model('user').upsert = upsertMock;

    await repo.updateLastLogoutTimestamp(201701562);

    expect(upsertMock).toBeCalledTimes(1);
  });
});

const getRepository = function() {
  const dataSource = new (class UserRemoteDataSourceMock extends UserDataSource {
      userExists(id) {
        return true;
      }

      fetchLoginResult(id, password) {
        if (id === 201701562 && password === 'password') {
          return RemoteLoginResult.SUCCESS;
        } else {
          return RemoteLoginResult.FAIL;
        }
      }
    });

  return new UserRepositoryImpl({
    db: sequelize,
    localDataSource: dataSource,
    remoteDataSource: dataSource,
  });
};
