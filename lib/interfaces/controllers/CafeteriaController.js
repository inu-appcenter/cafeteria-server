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

const Boom = require('@hapi/boom');

/**
 * Instances
 */
const menuConverterImpl = new MenuConverterImpl();
const menuConverter = new MenuConverter(menuConverterImpl);

const cafeteriaRepositoryImpl = new CafeteriaRepositoryImpl(menuConverter);
const cafeteriaRepository = new CafeteriaRepository(cafeteriaRepositoryImpl);

const cafeteriaSerializer = new BaseSerializer(new CafeteriaSerializer());
const cornerSerializer = new BaseSerializer(new CornerSerializer());
const menuSerializer = new BaseSerializer(new MenuSerializer());


module.exports = {

  async getCafeteria(request) {
    const id = request.params.id;

    const result = await GetCafeteria({id}, {cafeteriaRepository});

    if (!result) {
      return Boom.notFound();
    }

    return cafeteriaSerializer.serialize(result);
  },

  async getCorners(request) {
    const id = request.params.id; /* in the url */
    const cafeteriaId = request.query.cafeteriaId; /* after '?' */

    const result = await GetCorners({id, cafeteriaId}, {cafeteriaRepository});

    if (!result) {
      return Boom.notFound();
    }

    return cornerSerializer.serialize(result);
  },

  async getMenus(request) {
    const cornerId = request.query.cornerId;
    const date = request.query.date;

    const result = await GetMenus({cornerId, date}, {cafeteriaRepository});

    return menuSerializer.serialize(result);
  },

};
