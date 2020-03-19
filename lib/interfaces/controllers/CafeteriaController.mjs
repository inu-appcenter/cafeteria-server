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

import resolve from '../../common/di/resolve';

import CafeteriaSerializer from '../serializers/CafeteriaSerializer';
import CornerSerializer from '../serializers/CornerSerializer';
import MenuSerializer from '../serializers/MenuSerializer';
import GetCafeteria from '../../domain/usecases/GetCafeteria';
import GetCorners from '../../domain/usecases/GetCorners';
import GetMenus from '../../domain/usecases/GetMenus';

import Boom from '@hapi/boom';

export default {

  async getCafeteria(request) {
    const {id} = request.params;

    const result = await resolve(GetCafeteria).run({id});

    if (!result) {
      return Boom.notFound();
    }

    return resolve(CafeteriaSerializer).serialize(result);
  },

  async getCorners(request) {
    const {id} = request.params; /* in the url path */
    const {cafeteriaId} = request.query; /* after '?' */

    const result = await resolve(GetCorners).run({id, cafeteriaId});

    if (!result) {
      return Boom.notFound();
    }

    return resolve(CornerSerializer).serialize(result);
  },

  async getMenus(request) {
    const {cornerId, date} = request.query;

    const result = await resolve(GetMenus).run({cornerId, date});

    if (!result) {
      return Boom.notFound();
    }

    return resolve(MenuSerializer).serialize(result);
  },

};
