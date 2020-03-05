/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020 INU Global Appcenter <potados99@gmail.com>
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
'use strict';

class CafeteriaRepository {
  getAllCafeteria() {
    throw new Error('Not implemented!');
  }

  getCafeteriaById(id) {
    throw new Error('Not implemented!');
  }

  getAllCorners() {
    throw new Error('Not implemented!');
  }

  getCornerById(id) {
    throw new Error('Not implemented!');
  }

  getCornersByCafeteriaId(cafeteriaId) {
    throw new Error('Not implemented!');
  }

  getAllMenus(date=null) {
    throw new Error('Not implemented!');
  }

  getMenusByCornerId(cornerId, date=null) {
    throw new Error('Not implemented!');
  }
}

export default CafeteriaRepository;
