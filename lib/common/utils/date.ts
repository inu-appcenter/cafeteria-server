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

export function assertDateStringFormat(dateString: string) {
  if (!/([12]\d{3}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01]))/.test(dateString)) {
    throw new Error('날짜 포맷이 올바르지 않습니다. YYYYMMDD만 허용합니다.');
  }
}

export function formatDateString(date: Date, dash: boolean = false) {
  const mm = (date.getMonth() + 1).toString(); // getMonth() 는 0부터 시작
  const dd = date.getDate().toString();

  return [
    date.getFullYear(),
    dash ? '-' : '',
    mm.length === 2 ? '' : '0',
    mm,
    dash ? '-' : '',
    dd.length === 2 ? '' : '0',
    dd,
  ].join('');
}

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
export function getWeeksBetweenDates(d0: Date, d1: Date, startDay: number = 1) {
  // Copy dates so don't affect originals
  d0 = new Date(d0);
  d1 = new Date(d1);

  const setDateToStartOfThatWeek = (date: Date) => {
    date.setDate(date.getDate() + ((startDay - date.getDay() - 7) % 7));
  };

  [d0, d1].forEach(setDateToStartOfThatWeek);

  return Math.round((d1.getTime() - d0.getTime()) / 6.048e8 /*7 days in millis*/);
}
