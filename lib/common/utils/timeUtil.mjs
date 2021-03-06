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

import moment from 'moment';
import logger from './logger';

export default {
  isTimeInRange(timeRangeString, now = moment(Date.now())) {
    const timeRangeStringValid = /^[0-2][0-9]:[0-5][0-9]-[0-2][0-9]:[0-5][0-9]$/.test(timeRangeString);

    if (!timeRangeStringValid) {
      logger.warn(`isTimeInRange: invalid time range format: ${timeRangeString}`);
      return false;
    }

    const [start, end] = timeRangeString
      .split('-')
      .map((timeString) => moment(timeString, 'hh:mm'));

    return now.isBetween(start, end, null, '[)');
  },

  /**
   * Get index of time range 'now' takes place.
   * @param timeRangeStrings
   * @param now
   */
  inWhichTimeRange(timeRangeStrings, now = moment(Date.now())) {
    for (const timeRange of timeRangeStrings) {
      if (this.isTimeInRange(timeRange, now)) {
        return timeRangeStrings.indexOf(timeRange);
      }
    }

    return -1;
  },
};
