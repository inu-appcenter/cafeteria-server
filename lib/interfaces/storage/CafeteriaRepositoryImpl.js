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

import CafeteriaRepository from 'domain/repositories/CafeteriaRepository';
import Cafeteria from 'domain/entities/Cafeteria';
import Corner from 'domain/entities/Corner';

import sequelize from 'infrastructure/database/sequelize';
import fetch from 'infrastructure/network/fetch';

import config from 'config/config';
import logger from 'common/utils/logger';

class CafeteriaRepositoryImpl extends CafeteriaRepository {
  constructor(menuConverter) {
    super();

    // db
    this.db = sequelize;

    // db models
    this.cafeteriaModel = this.db.model('cafeteria');
    this.cornerModel = this.db.model('corner');

    // menu conversion
    this.menuConverter = menuConverter;
    this.menuCache = {
      menus: {},
      updated: 0, /* millis */
    };
  }

  async getAllCafeteria() {
    const seqCafeteria = await this.cafeteriaModel.findAll();

    return seqCafeteria.map((seqCafeteria) => {
      return new Cafeteria({
        id: seqCafeteria.id,
        name: seqCafeteria.name,
        imagePath: seqCafeteria.image_path,
      });
    });
  }

  async getCafeteriaById(id) {
    const seqCafeteria = await this.cafeteriaModel.findByPk(id);

    if (!seqCafeteria) return null;

    return new Cafeteria({
      id: seqCafeteria.id,
      name: seqCafeteria.name,
      imagePath: seqCafeteria.image_path,
    });
  }

  async getAllCorners() {
    const seqCorners = await this.cornerModel.findAll();

    return seqCorners.map((seqCorner) => {
      return new Corner({
        id: seqCorner.id,
        name: seqCorner.name,
        cafeteriaId: seqCorner.cafeteria_id,
      });
    });
  }

  async getCornerById(id) {
    const seqCorner = await this.cornerModel.findByPk(id);

    if (!seqCorner) return null;

    return new Corner({
      id: seqCorner.id,
      name: seqCorner.name,
      cafeteriaId: seqCorner.cafeteria_id,
    });
  }

  async getCornersByCafeteriaId(cafeteriaId) {
    const seqCorners = await this.cornerModel.findAll({
      where: {cafeteria_id: cafeteriaId},
    });

    return seqCorners.map((seqCorner) => {
      return new Corner({
        id: seqCorner.id,
        name: seqCorner.name,
        cafeteriaId: seqCorner.cafeteria_id,
      });
    });
  }

  async getAllMenus(date) {
    const allMenus = await this._getLatestMenus(date || new Date().yyyymmdd());
    return allMenus;
  }

  async getMenusByCornerId(cornerId, date) {
    const allMenus = await this._getLatestMenus(date || new Date().yyyymmdd());
    return allMenus.filter((menu) => menu.cornerId === cornerId);
  }

  async _getLatestMenus(date) {
    if (!/([12]\d{3}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01]))/.test(date)) {
      logger.error('Bad date format: ' + date);
      return [];
    }

    const nowMillis = Date.now();

    const diff = nowMillis - this.menuCache.updated;
    const cacheOld = diff > config.menu.fetchInterval;
    const noData = this.menuCache.menus[date] == null;

    if (cacheOld || noData) {
      try {
        const json = await fetch.getJson(config.menu.url, {stdDate: date});
        this.menuCache.menus[date] = this.menuConverter.convert(json);
        this.menuCache.updated = Date.now();
      } catch (e) {
        logger.error(e);
      }
    }

    if (!this.menuCache.menus[date]) {
      logger.error('No menu after fetch!');
      return [];
    }

    return this.menuCache.menus[date];
  }
}

export default CafeteriaRepositoryImpl;
