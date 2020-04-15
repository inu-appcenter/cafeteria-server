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

import UseCase from './UseCase';

/**
 * Get corners with given corner id or cafeteria id.
 * If nothing specified, find all.
 */
class GetCorners extends UseCase {
  constructor({cafeteriaRepository}) {
    super();

    this.cafeteriaRepository = cafeteriaRepository;
  }

  async onExecute({id, cafeteriaId}) {
    if (id) {
      return this.cafeteriaRepository.getCornerById(id);
    } else if (cafeteriaId) {
      return this.cafeteriaRepository.getCornersByCafeteriaId(cafeteriaId);
    } else {
      return this.cafeteriaRepository.getAllCorners();
    }
  }
}

export default GetCorners;
