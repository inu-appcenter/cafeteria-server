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

  format(date, dash=false) {
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

  isBetween(date, timeRanges, graceMinutes=0) {
    const thisMoment = moment(date);

    const timeRangeMoments = timeRanges.map((range) => {
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

    return -2;
  },

};
