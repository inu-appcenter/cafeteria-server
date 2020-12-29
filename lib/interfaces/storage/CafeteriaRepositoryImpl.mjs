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

import config from '../../../config';
import logger from '../../common/utils/logger';
import dateUtil from '../../common/utils/dateUtil';
import CafeteriaKioskNumbers from '../../domain/entities/CafeteriaKioskNumbers.mjs';
import {separateNumbersFromCommaJoinedString} from '../../common/utils/stringUtil.mjs';

/**
 * Implementation of CafeteriaRepository.
 */
class CafeteriaRepositoryImpl extends CafeteriaRepository {
  constructor({db, remoteDataSource, menuConverter}) {
    super();

    this.db = db;
    this.cafeteriaModel = this.db.model('cafeteria');
    this.cornerModel = this.db.model('corner');
    this.kioskNumbersModel = this.db.model('cafeteria_kiosk_numbers');

    this.remoteDataSource = remoteDataSource;

    this.menuConverter = menuConverter;
    this.menuCache = {
      menus: {},
      lastUpdatedMillis: 0,
    };
  }

  async getAllCafeteria() {
    const seqCafeteria = await this.cafeteriaModel.findAll();

    return seqCafeteria.map((seqCafeteria) => this._seqCafeteriaToCafeteria(seqCafeteria));
  }

  async getCafeteriaById(id) {
    if (!id) {
      return null;
    }

    const seqCafeteria = await this.cafeteriaModel.findByPk(id);

    if (!seqCafeteria) {
      return null;
    }

    return this._seqCafeteriaToCafeteria(seqCafeteria);
  }

  _seqCafeteriaToCafeteria(seqCafeteria) {
    return new Cafeteria({
      id: seqCafeteria.id,
      name: seqCafeteria.name,
      displayName: seqCafeteria.display_name,
      imagePath: seqCafeteria.image_path,
      supportMenu: seqCafeteria.support_menu,
      supportDiscount: seqCafeteria.support_discount,
      supportNotification: seqCafeteria.support_notification,
    });
  }

  async getAllCorners() {
    const seqCorners = await this.cornerModel.findAll();

    return seqCorners.map((seqCorner) => this._seqCornerToCorner(seqCorner));
  }

  async getCornerById(id) {
    if (!id) {
      return null;
    }

    const seqCorner = await this.cornerModel.findByPk(id);

    if (!seqCorner) {
      return null;
    }

    return this._seqCornerToCorner(seqCorner);
  }

  _seqCornerToCorner(seqCorner) {
    return new Corner({
      id: seqCorner.id,
      name: seqCorner.name,
      displayName: seqCorner.display_name,
      availableAt: seqCorner.available_at,
      cafeteriaId: seqCorner.cafeteria_id,
    });
  }

  async getCornersByCafeteriaId(cafeteriaId) {
    if (!cafeteriaId) {
      return null;
    }

    const seqCorners = await this.cornerModel.findAll({
      where: {cafeteria_id: cafeteriaId},
    });

    return seqCorners.map((seqCorner) => this._seqCornerToCorner(seqCorner));
  }

  async getAllMenus(date) {
    return await this._getLatestMenus(date || dateUtil.format(new Date()));
  }

  async getMenusByCornerId(cornerId, date) {
    if (!cornerId) {
      return [];
    }

    const allMenus = await this._getLatestMenus(date || dateUtil.format(new Date()));
    return allMenus.filter((menu) => menu.cornerId === cornerId);
  }

  async _getLatestMenus(date) {
    if (!/([12]\d{3}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01]))/.test(date)) {
      logger.warn('Bad date format: ' + date);
      return [];
    }

    await this._fetchAndStoreIfNeeded(date);

    if (!this._hasMenus(date)) {
      logger.warn('No menu after fetch!');
      return [];
    }

    return this.menuCache.menus[date];
  }

  async _fetchAndStoreIfNeeded(date) {
    const nowMillis = Date.now();

    const diff = nowMillis - this.menuCache.lastUpdatedMillis;
    const cacheOld = diff > config.menu.fetchIntervalMillis;
    const noData = this.menuCache.menus[date] == null;

    if (cacheOld || noData) {
      logger.info(`Time to fetch menus on ${date}.`);

      await this._fetchAndStore(date);
    }
  }

  async _fetchAndStore(date) {
    try {
      const cafeteria = await this.getAllCafeteria();

      const corners = await this.getAllCorners();
      const rawHtml = await this.remoteDataSource.fetchRawMenus(date);

      this.menuCache.menus[date] = await this.menuConverter.convert({cafeteria, corners, rawHtml});
      this.menuCache.lastUpdatedMillis = Date.now();
    } catch (e) {
      console.log(e);

      logger.error(e);
    }
  }

  _hasMenus(date) {
    return Array.isArray(this.menuCache.menus[date]) && this.menuCache.menus[date].length;
  }

  async getCafeteriaIdByPosNumber(posNumber) {
    const allKioskNumbers = await this._getAllCafeteriaKioskNumbers();
    const found = allKioskNumbers.find((it) => it.kioskNumbers.includes(posNumber));

    if (!found) {
      return null;
    }

    return found.cafeteriaId;
  }

  async _getAllCafeteriaKioskNumbers() {
    const all = await this.kioskNumbersModel.findAll();

    return all.map((seqKioskNumbers) => {
      return new CafeteriaKioskNumbers({
        kioskNumbers: separateNumbersFromCommaJoinedString(seqKioskNumbers.kiosk_numbers),
        cafeteriaId: seqKioskNumbers.cafeteria_id,
      });
    });
  }
}

export default CafeteriaRepositoryImpl;
