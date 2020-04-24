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
import MenuConverter from '../../../../lib/interfaces/converters/MenuConverter';
import config from '../../../../config';
import sequelize from '../../infrastructure/database/sequelizeMock';
import CafeteriaDataSource from '../../../../lib/domain/repositories/CafeteriaDataSource';

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
    const result = await repo.getAllMenus('sjejakawd');

    expect(result).toEqual([]);
  });

  it('should succeed', async () => {
    const repo = getRepository();
    const result = await repo.getAllMenus(null);

    expect(result.length).toBeGreaterThan(0);

    result.forEach((corner) => {
      expect(corner).toHaveProperty('foods');
      expect(corner).toHaveProperty('cornerId');
    });
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
  });
});

const getRepository = function() {
  return new CafeteriaRepositoryImpl({
    db: sequelize,
    remoteDataSource: new (class CafeteriaRemoteDataSourceMock extends CafeteriaDataSource {
      fetchRawMenus() {
        return rawMenuExample;
      }
    }),
    menuConverter: new MenuConverter(config.cornerMenuKeys),
  });
};

const rawMenuExample = JSON.parse('{"stdDate":"20200312","foodMenuType3Result":[{"TYPE2":"2","FOODMENU_TYPE":"3","STD_DATE":"20200312","MENU":"*개교기념일*","TYPE1":"1"},{"TYPE2":"3","FOODMENU_TYPE":"3","STD_DATE":"20200312","MENU":null,"TYPE1":"1"}],"afterDay":"20200313","foodMenuType5Result":[{"TYPE2":"2","FOODMENU_TYPE":"5","STD_DATE":"20200312","MENU":"*개교기념일*","TYPE1":"1"},{"TYPE2":"3","FOODMENU_TYPE":"5","STD_DATE":"20200312","MENU":"*개교기념일*","TYPE1":"1"}],"dayOfWeekString":"목","foodMenuType1Result":[{"TYPE2":"0","FOODMENU_TYPE":"1","STD_DATE":"20200312","MENU":"춘천닭갈비카레고로케 시금치나물 콩나물국 쌀밥3500원 755kcal------------ 1-1코너 덮밥마라크림덮밥오이피클 콩나물국3000원 722kcal","TYPE1":"1"},{"TYPE2":"0","FOODMENU_TYPE":"1","STD_DATE":"20200312","MENU":"뚝배기돼지갈비찜어묵볶음 숙주나물 두부무채국 쌀밥3800원 769kcal","TYPE1":"2"},{"TYPE2":"0","FOODMENU_TYPE":"1","STD_DATE":"20200312","MENU":"점보돈까스*야채볶음밥오이피클 샐러드파스타 크림스프4000원 806kcal","TYPE1":"3"},{"TYPE2":"0","FOODMENU_TYPE":"1","STD_DATE":"20200312","MENU":"떡튀순세트(눈꽃치즈떡볶이+모듬튀김+순대)두부무채국 3500원 777kcal","TYPE1":"4"},{"TYPE2":"0","FOODMENU_TYPE":"1","STD_DATE":"20200312","MENU":"&lt;즉석조리기기&gt; 신라면진라면안성탕면너구리 짜파게티즉석라볶이","TYPE1":"5"},{"TYPE2":"0","FOODMENU_TYPE":"1","STD_DATE":"20200312","MENU":"순대국밥 수육국밥 얼큰국밥[부추*양파초절이]4,800원 5,000원","TYPE1":"6"},{"TYPE2":"0","FOODMENU_TYPE":"1","STD_DATE":"20200312","MENU":null,"TYPE1":"7"}],"beforeDay":"20200311","foodMenuType4Result":[],"foodMenuType2Result":[]}');
