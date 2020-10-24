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
   * Returns the week number for this date.  dowOffset is the day of week the week
   * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
   * the week returned is the ISO 8601 week number.
   * @param int dowOffset
   * @return int
   */
  getWeek(date, dowOffset) {
    /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

    dowOffset = typeof (dowOffset) === 'number' ? dowOffset : 0; //default dowOffset to zero
    const newYear = new Date(date.getFullYear(), 0, 1);
    let day = newYear.getDay() - dowOffset; //the day of week the year begins on
    day = (day >= 0 ? day : day + 7);
    const dayNum = Math.floor((date.getTime() - newYear.getTime() -
      (date.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
    let weekNum;
    //if the year starts before the middle of a week
    if (day < 4) {
      weekNum = Math.floor((dayNum + day - 1) / 7) + 1;
      if (weekNum > 52) {
        const nYear = new Date(date.getFullYear() + 1, 0, 1);
        let nDay = nYear.getDay() - dowOffset;
        nDay = nDay >= 0 ? nDay : nDay + 7;
        /*if the next year starts before the middle of
          the week, it is week #1 of that year*/
        weekNum = nDay < 4 ? 1 : 53;
      }
    } else {
      weekNum = Math.floor((dayNum + day - 1) / 7);
    }

    return weekNum;
  },

};
