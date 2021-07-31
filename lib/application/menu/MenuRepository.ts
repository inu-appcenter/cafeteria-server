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

import {Cafeteria, Menu} from '@inu-cafeteria/backend-core';
import {assertDateStringFormat} from '../../common/utils/date';
import logger from '../../common/logging/logger';
import assert from 'assert';
import config from '../../../config';
import CoopRepository from './CoopRepository';
import MenuParser from './parser/MenuParser';

class MenuRepository {
  private menuCache = {
    menus: new Map<string, Menu[]>(),
    lastUpdatedMillis: 0,
  };

  async getAllMenus(dateString: string): Promise<Menu[]> {
    return await this.getLatestMenus(dateString);
  }

  async getMenusByCornerId(cornerId: number, dateString: string): Promise<Menu[]> {
    const all = await this.getAllMenus(dateString);

    return all.filter((m) => m.cornerId === cornerId);
  }

  private async getLatestMenus(dateString: string) {
    assertDateStringFormat(dateString);

    await this.fetchAndStoreIfNeeded(dateString);

    return this.getMenusFromCache(dateString);
  }

  private async fetchAndStoreIfNeeded(dateString: string) {
    const nowMillis = Date.now();
    const elapsedFromLastFetch = nowMillis - this.menuCache.lastUpdatedMillis;

    const cacheIsOld = elapsedFromLastFetch > config.menu.fetchIntervalMillis;
    const dataNotExist = this.menuCache.menus.get(dateString) == null;

    if (cacheIsOld || dataNotExist) {
      logger.info('메뉴 가져올 시간~');

      await this.fetchAndStore(dateString);
    }
  }

  private async fetchAndStore(dateString: string) {
    const rawHtml = await CoopRepository.fetchRawMenusPage(dateString);
    const cafeteriaWithCorners = await Cafeteria.find({relations: ['corners']});

    const parsed = await new MenuParser({rawHtml, cafeteriaWithCorners}).parse();

    this.menuCache.menus.set(dateString, parsed);
    this.menuCache.lastUpdatedMillis = Date.now();
  }

  private getMenusFromCache(dateString: string) {
    const fromCache = this.menuCache.menus.get(dateString);

    assert(fromCache, '메뉴 캐시에 정보가 없습니다.');

    return fromCache;
  }
}

export default new MenuRepository();
