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

import CafeteriaRepository from '../../domain/repositories/CafeteriaRepository';
import Cafeteria from '../../domain/entities/Cafeteria';
import Corner from '../../domain/entities/Corner';

import sequelize from '../../infrastructure/database/sequelize';
import fetch from '../../common/utils/fetch';

import config from '../../../config';
import logger from '../../common/utils/logger';
import dateUtil from '../../common/utils/dateUtil';

/**
 * Implementation of CafeteriaRepository.
 */
class CafeteriaRepositoryImpl extends CafeteriaRepository {
  constructor({menuConverter}) {
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

  /**
   * Get all cafeteria.
   *
   * @return {Promise<[]>} collection of Cafeteria.
   * Could be empty but must not be null nor undefined.
   */
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

  /**
   * Get cafeteria by id.
   *
   * @param {number} id of the Cafeteria we want to find.
   * @return {Promise<Cafeteria>} Cafeteria instance if succeeded, or null.
   */
  async getCafeteriaById(id) {
    const seqCafeteria = await this.cafeteriaModel.findByPk(id);

    if (!seqCafeteria) return null;

    return new Cafeteria({
      id: seqCafeteria.id,
      name: seqCafeteria.name,
      imagePath: seqCafeteria.image_path,
    });
  }

  /**
   * Get all corners.
   *
   * @return {Promise<[]>} array of Corner.
   */
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

  /**
   * Get a corner by its id.
   *
   * @param {number} id the id of the corner we want.
   * @return {Promise<Corner|null>} the instance if succeeded, or null.
   */
  async getCornerById(id) {
    const seqCorner = await this.cornerModel.findByPk(id);

    if (!seqCorner) {
      return null;
    }

    return new Corner({
      id: seqCorner.id,
      name: seqCorner.name,
      cafeteriaId: seqCorner.cafeteria_id,
    });
  }

  /**
   * Get corners those have cafeteria id as foreign key.
   *
   * @param {number} cafeteriaId id of Cafeteria the Corners belong to.
   * @return {Promise<[]>} array of Corner.
   */
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

  /**
   * Get all menus of a day.
   *
   * @param {string} date we want menus of this day.
   * @return {Promise<[]>} array of Menus.
   */
  async getAllMenus(date) {
    return await this._getLatestMenus(date || dateUtil.format(new Date()));
  }

  /**
   * Get menus filtered by corner id.
   *
   * @param {number} cornerId id of a Corner that the menus belong to.
   * @param {string} date menus are for this date.
   * @return {Promise<[]>} array of Menus.
   */
  async getMenusByCornerId(cornerId, date) {
    const allMenus = await this._getLatestMenus(date || dateUtil.format(new Date()));
    return allMenus.filter((menu) => menu.cornerId === cornerId);
  }

  /**
   * Fetch menus and update cache.
   *
   * @param {string} date target date of menus.
   * @return {Promise<[]>} array of menus.
   * @private
   */
  async _getLatestMenus(date) {
    if (!/([12]\d{3}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01]))/.test(date)) {
      logger.warn('Bad date format: ' + date);
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

    const hasData = Array.isArray(this.menuCache.menus[date]) && this.menuCache.menus[date].length;

    if (!hasData) {
      logger.warn('No menu after fetch!');
      return [];
    }

    return this.menuCache.menus[date];
  }
}

export default CafeteriaRepositoryImpl;
