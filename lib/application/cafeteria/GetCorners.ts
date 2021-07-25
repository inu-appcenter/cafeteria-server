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

import UseCase from '../../common/base/UseCase';
import {Corner} from '@inu-cafeteria/backend-core';

export type GetCornersParams = {
  id?: number;
  cafeteriaId?: number;
};

class GetCorners extends UseCase<GetCornersParams, Corner | Corner[] | undefined> {
  async onExecute({id, cafeteriaId}: GetCornersParams): Promise<Corner | Corner[] | undefined> {
    if (id) {
      return await Corner.findOneOrFail(id);
    } else if (cafeteriaId) {
      return await Corner.find({where: {cafeteriaId}});
    } else {
      return await Corner.find();
    }
  }
}

export default new GetCorners();
