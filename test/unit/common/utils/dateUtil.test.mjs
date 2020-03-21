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

import dateUtil from '../../../../lib/common/utils/dateUtil';

describe('# Format', () => {
  it('should catch null date', async () => {
    expect(() => dateUtil.format(null, false)).toThrow();
  });

  it('should work', async () => {
    expect(dateUtil.format(new Date(2020, 0, 1), true)).toBe('2020-01-01');
    expect(dateUtil.format(new Date(2020, 0, 1), false)).toBe('20200101');
  });
});

describe('# IsBetween', () => {
  it('should catch null params', async () => {
    expect(() => dateUtil.isBetween(null, null, 0)).toThrow();
  });

  it('should catch NaN graceMinute', async () => {
    expect(() => dateUtil.isBetween(new Date(), [], 'hey!')).toThrow();
  });

  it('should catch invalid time range: null at start', async () => {
    const timeRanges = [
      {start: null, end: [9, 35]}, /* breakfast */
    ];
    expect(() => dateUtil.isBetween(new Date(), timeRanges, 0)).toThrow();
  });

  it('should catch invalid time range: not an array', async () => {
    const timeRanges = [
      {start: 123, end: [9, 35]}, /* breakfast */
    ];
    expect(() => dateUtil.isBetween(new Date(), timeRanges, 0)).toThrow();
  });

  it('should catch invalid time range: array length not 2', async () => {
    const timeRanges = [
      {start: [1, 2, 3], end: [9, 35]}, /* breakfast */
    ];
    expect(() => dateUtil.isBetween(new Date(), timeRanges, 0)).toThrow();
  });

  it('should work: in right range', async () => {
    const timeRanges = [
      {start: [7, 25], end: [9, 35]}, /* breakfast */
      {start: [10, 20], end: [14, 10]}, /* lunch */
      {start: [16, 30], end: [23, 40]}, /* dinner */
    ];

    expect(
      dateUtil.isBetween(
        new Date(2020, 2, 21, 8, 50, 0),
        timeRanges,
        0),
    ).toBe(0);
  });

  it('should work: out of range', async () => {
    const timeRanges = [
      {start: [7, 25], end: [9, 35]}, /* breakfast */
      {start: [10, 20], end: [14, 10]}, /* lunch */
      {start: [16, 30], end: [23, 40]}, /* dinner */
    ];

    expect(
      dateUtil.isBetween(
        new Date(2020, 2, 21, 9, 40, 0),
        timeRanges,
        0),
    ).toBe(-1);
  });

  it('should work: out of range but graced', async () => {
    const timeRanges = [
      {start: [7, 25], end: [9, 35]}, /* breakfast */
      {start: [10, 20], end: [14, 10]}, /* lunch */
      {start: [16, 30], end: [23, 40]}, /* dinner */
    ];

    expect(
      dateUtil.isBetween(
        new Date(2020, 2, 21, 9, 40, 0),
        timeRanges,
        5),
    ).toBe(0);
  });
});
