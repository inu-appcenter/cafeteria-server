/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020 INU Appcenter <potados99@gmail.com>
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

import Injector from '@common/di/Injector';

import GetCafeteria from '@domain/usecases/GetCafeteria';
import GetCorners from '@domain/usecases/GetCorners';
import GetMenus from '@domain/usecases/GetMenus';

import MenuSerializer from '@interfaces/serializers/MenuSerializer';
import CafeteriaSerializer from '@interfaces/serializers/CafeteriaSerializer';
import CornerSerializer from '@interfaces/serializers/CornerSerializer';

import Boom from '@hapi/boom';

const getCafeteria = Injector.resolve(GetCafeteria);
const getCorners = Injector.resolve(GetCorners);
const getMenus = Injector.resolve(GetMenus);

const cafeteriaSerializer = Injector.resolve(CafeteriaSerializer);
const cornerSerializer = Injector.resolve(CornerSerializer);
const menuSerializer = Injector.resolve(MenuSerializer);

export default {

  async getCafeteria(request) {
    const {id} = request.params;

    const result = await getCafeteria.run({id});

    if (!result) {
      return Boom.notFound();
    }

    return cafeteriaSerializer.serialize(result);
  },

  async getCorners(request) {
    const {id} = request.params; /* in the url path */
    const {cafeteriaId} = request.query; /* after '?' */

    const result = await getCorners.run({id, cafeteriaId});

    if (!result) {
      return Boom.notFound();
    }

    return cornerSerializer.serialize(result);
  },

  async getMenus(request) {
    const {cornerId, date} = request.query;

    const result = await getMenus.run({cornerId, date});

    return menuSerializer.serialize(result);
  },

};
