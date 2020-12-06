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

import CafeteriaDataSource from '../../domain/repositories/CafeteriaDataSource';
import config from '../../../config';

import moment from 'moment';
import dateUtil from '../../common/utils/dateUtil';
import logger from '../../common/utils/logger';

class CafeteriaRemoteDataSource extends CafeteriaDataSource {
  constructor({coopRepo}) {
    super();
    this.coopRepo = coopRepo;
  }

  async fetchRawMenus(dateString) {
    // 20201025
    // I cannot imagine what is happening.
    // The UICOOP menu page got paginating feature and no more respond to 'sdt' query parameter.
    // We have to send a POST request with 'sdt' and 'jun' in url-encoded body.
    // The 'jun' indicates a week. -1 for this week, 0 for next week, 1 for next of that week.
    // A 'week' starts on Monday, ends on Sunday.
    // For a given date, we have to get how many weeks after the target date takes place.
    //
    // 20201202
    // Damn. Again the response got out of my expectation.
    // Two changes happened:
    // - Fetching menus next week is blocked for clients(API still valid)
    // - Not add -1 to weekOffset anymore. It looks like it was a bug. 0 is this week.
    //
    // 20201206
    // The -1 problem is solved.
    // It was because the UICOOP server thinks a week starts from Sunday,
    // in contrast to the UICOOP webpage UI.
    // We tell the dateUtil that a week starts from Sunday(by setting dowOffset 0) and it works.
    const weekOffset = this._howManyWeeksToGoUntil(dateString);
    const body = {};
    body[config.menu.dateArgName] = dateString;
    body[config.menu.weekArgName] = weekOffset;

    logger.info(`Parsing menus on date ${dateString}. Week diff is ${weekOffset}.`);

    return await this.coopRepo.visit({
      url: config.menu.url,
      method: config.menu.method,
      data: body,
    });
  }

  _howManyWeeksToGoUntil(dateString) {
    const theDay = moment(dateString, 'YYYYMMDD').toDate();

    // Week starts from Monday, so dowOffset is 1.
    return dateUtil.getWeekDiff(theDay);
  }
}

export default CafeteriaRemoteDataSource;
