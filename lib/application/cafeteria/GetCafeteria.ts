/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2021 INU Global App Center <potados99@gmail.com>
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
import {Cafeteria} from '@inu-cafeteria/backend-core';
import assert from 'assert';
import {ResourceNotFound} from '../../common/errors/Errors';

export type GetCafeteriaParams = {
  id?: number;
  withCorners?: boolean;
};

class GetCafeteria extends UseCase<GetCafeteriaParams, Cafeteria | Cafeteria[] | undefined> {
  async onExecute({
    id,
    withCorners,
  }: GetCafeteriaParams): Promise<Cafeteria | Cafeteria[] | undefined> {
    const options = withCorners ? {relations: ['corners']} : {};

    if (id) {
      const found = await Cafeteria.findOne(id, options);

      assert(found, ResourceNotFound());

      return found;
    } else {
      return await Cafeteria.find(options);
    }
  }
}

export default new GetCafeteria();
