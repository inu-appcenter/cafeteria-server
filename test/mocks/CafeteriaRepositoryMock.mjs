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

import CafeteriaRepository from '../../lib/domain/repositories/CafeteriaRepository';
import Cafeteria from '../../lib/domain/entities/Cafeteria';
import Corner from '../../lib/domain/entities/Corner';

class CafeteriaRepositoryMock extends CafeteriaRepository {
  constructor() {
    super();
  }

  async getAllCafeteria() {
    return [
      new Cafeteria({
        id: 1,
        name: '학생식당',
        displayName: '학생 식당',
        imagePath: '',
        supportMenu: 1,
        supportDiscount: 0,
        supportNotification: 0,
      }),
      new Cafeteria({
        id: 2,
        name: '27호관식당',
        displayName: '27호관 식당',
        imagePath: '',
        supportMenu: 1,
        supportDiscount: 0,
        supportNotification: 0,
      }),
      new Cafeteria({
        id: 3,
        name: '사범대식당',
        displayName: '사범대 식당',
        imagePath: '',
        supportMenu: 1,
        supportDiscount: 1,
        supportNotification: 0,
      }),
      new Cafeteria({
        id: 4,
        name: '제1기숙사식당',
        displayName: '제1기숙사 식당',
        imagePath: '',
        supportMenu: 1,
        supportDiscount: 1,
        supportNotification: 0,
      }),
      new Cafeteria({
        id: 5,
        name: '2호관식당',
        displayName: '2호관 식당',
        imagePath: '',
        supportMenu: 1,
        supportDiscount: 0,
        supportNotification: 0,
      }),
    ];
  }

  getCafeteriaById(id) {
    if (id > 99) {
      return null;
    }

    return new Cafeteria({
      id: id,
      name: 'name',
      imagePath: 'path',
      supportMenu: false,
      supportDiscount: false,
      supportNotification: false,
    });
  }

  async getAllCorners() {
    return [
      new Corner({
        id: 1,
        name: '1코너중식(앞쪽)',
        displayName: '1코너',
        availableAt: 2,
        cafeteriaId: 1,
      }),
      new Corner({
        id: 2,
        name: '1-1코너중식(앞쪽)',
        displayName: '1-1코너',
        availableAt: 4,
        cafeteriaId: 1,
      }),
      new Corner({
        id: 3,
        name: '2-1코너 중식(앞쪽)',
        displayName: '2-1코너',
        availableAt: 2,
        cafeteriaId: 1,
      }),
      new Corner({
        id: 4,
        name: '2-1코너 석식(앞쪽)',
        displayName: '2-1코너',
        availableAt: 4,
        cafeteriaId: 1,
      }),
      new Corner({
        id: 5,
        name: '2-2코너 중식(앞쪽)',
        displayName: '2-2코너',
        availableAt: 2,
        cafeteriaId: 1,
      }),
      new Corner({
        id: 6,
        name: '3코너(앞쪽)',
        displayName: '3코너',
        availableAt: 6,
        cafeteriaId: 1,
      }),
      new Corner({
        id: 7,
        name: '4코너(뒤쪽)',
        displayName: '4코너',
        availableAt: 6,
        cafeteriaId: 1,
      }),
      new Corner({
        id: 8,
        name: '5코너(뒤쪽)',
        displayName: '5코너',
        availableAt: 6,
        cafeteriaId: 1,
      }),

      new Corner({
        id: 9,
        name: 'A코너 중식',
        displayName: 'A코너',
        availableAt: 2,
        cafeteriaId: 2,
      }),
      new Corner({
        id: 10,
        name: 'A코너 석식',
        displayName: 'A코너',
        availableAt: 4,
        cafeteriaId: 2,
      }),
      new Corner({
        id: 11,
        name: 'B코너 중식',
        displayName: 'B코너',
        availableAt: 2,
        cafeteriaId: 2,
      }),

      new Corner({
        id: 12,
        name: '중식',
        displayName: '',
        availableAt: 2,
        cafeteriaId: 3,
      }),
      new Corner({
        id: 13,
        name: '석식',
        displayName: '',
        availableAt: 4,
        cafeteriaId: 3,
      }),

      new Corner({
        id: 14,
        name: '조식',
        displayName: '',
        availableAt: 1,
        cafeteriaId: 4,
      }),
      new Corner({
        id: 15,
        name: '중식',
        displayName: '',
        availableAt: 2,
        cafeteriaId: 4,
      }),
      new Corner({
        id: 16,
        name: '석식',
        displayName: '',
        availableAt: 4,
        cafeteriaId: 4,
      }),

      new Corner({
        id: 17,
        name: '중식',
        displayName: '',
        availableAt: 2,
        cafeteriaId: 5,
      }),
      new Corner({
        id: 18,
        name: '석식',
        displayName: '',
        availableAt: 4,
        cafeteriaId: 5,
      }),
    ];
  }

  getCornerById(id) {

  }

  getAllMenus(date) {

  }

  getMenusByCornerId(cornerId, date = null) {

  }

  getAllComments() {
    return [];
  }

  getCommentByCafeteriaId(cafeteriaId) {
    return 'haha!';
  }

  getCafeteriaIdByPosNumber(posNumber) {
    return 1;
  }
}

export default CafeteriaRepositoryMock;
