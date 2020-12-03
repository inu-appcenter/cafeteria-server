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

import CafeteriaRepositoryImpl from '../../../../lib/interfaces/storage/CafeteriaRepositoryImpl';
import sequelize from '../../infrastructure/database/sequelizeMock';
import DirectMenuConverter from '../../../../lib/interfaces/converters/DirectMenuConverter';
import CafeteriaRemoteDataSource from '../../../../lib/interfaces/storage/CafeteriaRemoteDataSource';
import CoopRepositoryImpl from '../../../../lib/interfaces/storage/CoopRepositoryImpl';
import CafeteriaRepositoryMock from '../../../mocks/CafeteriaRepositoryMock';
import ParseRegexRepositoryMock from '../../../mocks/ParseRegexRepositoryMock';

describe('# getAllCafeteria', () => {
  it('should succeed', async () => {
    const repo = getRepository();
    const result = await repo.getAllCafeteria();

    result.forEach((cafeteria) => {
      expect(cafeteria).toHaveProperty('id');
    });
  });
});

describe('# getCafeteriaById', () => {
  it('should catch null id', async () => {
    const repo = getRepository();
    const result = await repo.getCafeteriaById(null);

    expect(result).toBeNull();
  });

  it('should get cafeteria of id 5', async () => {
    const repo = getRepository();
    const result = await repo.getCafeteriaById(5);

    expect(result).toHaveProperty('id', 5);
  });
});

describe('# getAllCorners', () => {
  it('should succeed', async () => {
    const repo = getRepository();
    const result = await repo.getAllCorners();

    result.forEach((corner) => {
      expect(corner).toHaveProperty('id');
      expect(corner).toHaveProperty('cafeteriaId');
    });
  });
});

describe('# getCornerById', () => {
  it('should fail with null id', async () => {
    const repo = getRepository();
    const result = await repo.getCornerById(null);

    expect(result).toBeNull();
  });

  it('should get corner of id 2', async () => {
    const repo = getRepository();
    const result = await repo.getCornerById(2);

    expect(result).toHaveProperty('id', 2);
  });
});

describe('# getCornersByCafeteriaId', () => {
  it('should fail with null id', async () => {
    const repo = getRepository();
    const result = await repo.getCornersByCafeteriaId(null);

    expect(result).toBeNull();
  });

  it('should get corners with cafeteria id 3', async () => {
    const repo = getRepository();
    const result = await repo.getCornersByCafeteriaId(3);

    result.forEach((corner) => {
      expect(corner).toHaveProperty('id');
      expect(corner).toHaveProperty('cafeteriaId', 3);
    });
  });
});

describe('# getAllMenus', () => {
  it('should catch bad date format', async () => {
    const repo = getRepository();
    const result = await repo.getAllMenus('awdadwa');

    expect(result).toEqual([]);
  });

  it('should get menus', async () => {
    // const repo = getRepository();
    // const result = await repo.getAllMenus('20201202');

    // Just see :)
    // console.log(result);
  });
});

describe('# getMenusByCornerId', () => {
  it('should fail with null corner id', async () => {
    const repo = getRepository();
    const result = await repo.getMenusByCornerId(null);

    expect(result).toEqual([]);
  });

  it('should succeed with corner id 3', async () => {
    const repo = getRepository();
    const result = await repo.getMenusByCornerId(3);

    result.forEach((corner) => {
      expect(corner).toHaveProperty('foods');
      expect(corner).toHaveProperty('cornerId');
    });
  }, 10000);
});

const getRepository = function() {
  const repository = new CafeteriaRepositoryImpl({
    db: sequelize,
    remoteDataSource: new CafeteriaRemoteDataSource({coopRepo: new CoopRepositoryImpl()}),
    menuConverter: new DirectMenuConverter({
      parseRegexRepository: new ParseRegexRepositoryMock(),
    }),
  });

  const mockRepository = new CafeteriaRepositoryMock();

  repository.getAllCafeteria = mockRepository.getAllCafeteria;
  repository.getAllCorners = mockRepository.getAllCorners;

  return repository;
};
