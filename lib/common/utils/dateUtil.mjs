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

export default {

  format(date, dash = false) {
    if (!date) {
      throw new Error('Cannot format: invalid date');
    }

    const mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based
    const dd = date.getDate().toString();

    return [
      date.getFullYear(),
      dash ? '-' : '',
      (mm.length === 2) ? '' : '0',
      mm,
      dash ? '-' : '',
      (dd.length === 2) ? '' : '0',
      dd,
    ].join(''); // padding
  },

  isBetween(date, timeRanges, graceMinutes = 0) {
    if (!date || !timeRanges) {
      throw new Error('Cannot get time section: invalid date or timeRanges');
    }

    if (isNaN(graceMinutes)) {
      throw new Error('Cannot get time section: graceMinutes is not a number');
    }

    const thisMoment = moment(date);

    const timeRangeMoments = timeRanges.map((range) => {
      if (!range.start || !range.end) {
        throw new Error('Invalid time range');
      }

      if (!Array.isArray(range.start) || !Array.isArray(range.end)) {
        throw new Error('Invalid time range');
      }

      if (range.start.length !== 2 || range.end.length !== 2) {
        throw new Error('Invalid time range');
      }

      return {
        start: moment(`${range.start[0]}:${range.start[1]}`, 'HH:mm'),
        end: moment(`${range.end[0]}:${range.end[1]}`, 'HH:mm'),
      };
    });

    for (let i = 0; i < timeRangeMoments.length; i++) {
      const inRange = thisMoment.isBetween(
        timeRangeMoments[i].start.subtract(graceMinutes, 'minutes'),
        timeRangeMoments[i].end.add(graceMinutes, 'minutes'),
        'minute'/* minute granularity */,
        '[]', /* include start and end. */
      );

      if (inRange) {
        return i;
      }
    }

    return -1;
  },

  /**
   * Original code from https://stackoverflow.com/a/50212311/11929317
   *
   * Calculate weeks between dates
   * Difference is calculated by getting date for start of week,
   * getting difference, dividing and rounding.
   *
   * @param {Date} d0 - date for start
   * @param {Date} d1 - date for end
   * @param {number} [startDay] - default is 1 (Monday)
   * @returns {number} weeks between dates, always positive
   */
  getWeeksBetweenDates(d0, d1, startDay = 1) {
    // Copy dates so don't affect originals
    d0 = new Date(d0);
    d1 = new Date(d1);

    const setDateToStartOfThatWeek = (date) => {
      date.setDate(date.getDate() + ((startDay - date.getDay() - 7) % 7));
    };

    [d0, d1].forEach(setDateToStartOfThatWeek);

    return Math.round((d1 - d0) / 6.048e8/*7 days in millis*/);
  },

};
