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

import {init, mockOnce} from '../../../../lib/common/di/resolve';

import CafeteriaController from '../../../../lib/interfaces/controllers/CafeteriaController';
import requestMock from './requestMock';
import UseCase from '../../../../lib/domain/usecases/UseCase';
import GetCafeteria from '../../../../lib/domain/usecases/GetCafeteria';

import Boom from '@hapi/boom';
import modules from '../../../../lib/common/di/modules';
import Cafeteria from '../../../../lib/domain/entities/Cafeteria';
import GetCorners from '../../../../lib/domain/usecases/GetCorners';
import Corner from '../../../../lib/domain/entities/Corner';
import GetMenus from '../../../../lib/domain/usecases/GetMenus';
import Menu from '../../../../lib/domain/entities/Menu';

beforeAll(async () => {
  await init(modules, false, false);
});

describe('# Get cafeteria', () => {
  const createMockedResponse = function(useCaseReturn, params={}, query={}) {
    const request = requestMock.getRequest({params, query});

    mockOnce(GetCafeteria, new (class GetCafeteriaMock extends UseCase {
      onExecute({id}) {
        return useCaseReturn;
      }
    }));

    return CafeteriaController.getCafeteria(request, requestMock.getH());
  };

  it('should not get cafeteria', async () => {
    const response = await createMockedResponse(null);

    expect(response).toBeInstanceOf(Boom.Boom);
  });

  it('shoult get empty cafeteria', async () => {
    const response = await createMockedResponse([]);

    expect(response).toEqual([]);
  });

  it('should get a single cafeteria', async () => {
    const response = await createMockedResponse(
      new Cafeteria({
        id: 1,
        name: 'cafeteria1',
        imagePath: 'path',
        supportMenu: true,
        supportDiscount: true,
        supportNotification: true,
      }),
    );

    expect(response).toEqual({
      'id': 1,
      'image-path': 'path',
      'name': 'cafeteria1',
      'support-discount': true,
      'support-menu': true,
      'support-notification': true,
    });
  });

  it('should get an array of single cafeteria', async () => {
    const response = await createMockedResponse([
      new Cafeteria({
        id: 1,
        name: 'cafeteria1',
        imagePath: 'path',
        supportMenu: true,
        supportDiscount: true,
        supportNotification: true,
      }),
    ]);

    expect(response).toEqual([{
           'id': 1,
           'image-path': 'path',
           'name': 'cafeteria1',
           'support-discount': true,
           'support-menu': true,
           'support-notification': true,
      }]);
  });
});

describe('# Get corners', () => {
  const createMockedResponse = function(useCaseReturn, params={}, query={}) {
    const request = requestMock.getRequest({params, query});

    mockOnce(GetCorners, new (class GetCornersMock extends UseCase {
      onExecute({id}) {
        return useCaseReturn;
      }
    }));

    return CafeteriaController.getCorners(request, requestMock.getH());
  };

  it('shoult not get corners', async () => {
    const response = await createMockedResponse(null);

    expect(response).toBeInstanceOf(Boom.Boom);
  });

  it('shoult get empty corners', async () => {
    const response = await createMockedResponse([]);

    expect(response).toEqual([]);
  });

  it('should get a single corner', async () => {
    const response = await createMockedResponse(
      new Corner({
        id: 1,
        name: 'corner1',
        cafeteriaId: 1,
      }),
    );

    expect(response).toEqual(
      {
        'cafeteria-id': 1,
        'id': 1,
        'name': 'corner1',
      },
    );
  });

  it('should get an array of a single corner', async () => {
    const response = await createMockedResponse([
      new Corner({
        id: 1,
        name: 'corner1',
        cafeteriaId: 1,
      }),
    ]);

    expect(response).toEqual([
      {
        'cafeteria-id': 1,
        'id': 1,
        'name': 'corner1',
      },
    ]);
  });
});

describe('# Get menus', () => {
  const createMockedResponse = function(useCaseReturn, params={}, query={}) {
    const request = requestMock.getRequest({params, query});

    mockOnce(GetMenus, new (class GetMenusMock extends UseCase {
      onExecute({cornerId, date}) {
        return useCaseReturn;
      }
    }));

    return CafeteriaController.getMenus(request, requestMock.getH());
  };

  it('shoult not get menus', async () => {
    const response = await createMockedResponse(null);

    expect(response).toBeInstanceOf(Boom.Boom);
  });

  it('shoult get empty menus', async () => {
    const response = await createMockedResponse([]);

    expect(response).toEqual([]);
  });

  it('should get an array of a single menu', async () => {
    const response = await createMockedResponse([
      new Menu({
        foods: 'foods',
        price: 500,
        calorie: 500,
        cornerId: 1,
      }),
    ]);

    expect(response).toEqual([
      {
        'calorie': 500,
        'corner-id': 1,
        'foods': 'foods',
        'price': 500,
      },
    ]);
  });
});
