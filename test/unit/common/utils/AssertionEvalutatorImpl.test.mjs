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

import AssertionEvaluator from '../../../../lib/common/utils/AssertionEvaluator';

describe('# Evaluate', () => {
  it('should support eq', async () => {
    expect(new AssertionEvaluator().evaluate({
      value: '4.0.0',
      assertion: '== 4.0.0',
    })).toBe(true);
  });

  it('should support lt', async () => {
    expect(new AssertionEvaluator().evaluate({
      value: '4.0.0',
      assertion: '< 4.0.0',
    })).toBe(false);
  });

  it('should support le', async () => {
    expect(new AssertionEvaluator().evaluate({
      value: '4.0.0',
      assertion: '<= 4.0.0',
    })).toBe(true);
  });

  it('should support gt', async () => {
    expect(new AssertionEvaluator().evaluate({
      value: '4.0.0',
      assertion: '> 4.0.0',
    })).toBe(false);
  });

  it('should support ge', async () => {
    expect(new AssertionEvaluator().evaluate({
      value: '4.0.0',
      assertion: '>= 4.0.0',
    })).toBe(true);
  });

  it('should support eq reversed', async () => {
    expect(new AssertionEvaluator().evaluate({
      value: '4.0.0',
      assertion: '4.0.0 ==',
    })).toBe(true);
  });

  it('should support lt reversed', async () => {
    expect(new AssertionEvaluator().evaluate({
      value: '4.0.0',
      assertion: '4.0.0 >',
    })).toBe(false);
  });

  it('should support le reversed', async () => {
    expect(new AssertionEvaluator().evaluate({
      value: '4.0.0',
      assertion: '4.0.0 >=',
    })).toBe(true);
  });

  it('should support gt reversed', async () => {
    expect(new AssertionEvaluator().evaluate({
      value: '4.0.0',
      assertion: '4.0.0 <',
    })).toBe(false);
  });

  it('should support ge reversed', async () => {
    expect(new AssertionEvaluator().evaluate({
      value: '4.0.0',
      assertion: '4.0.0 <=',
    })).toBe(true);
  });

  it('should support double comparison', async () => {
    expect(new AssertionEvaluator().evaluate({
      value: '4.0.0',
      assertion: '3.0.0 < <= 4.0.0',
    })).toBe(true);
  });

  it('should support double comparison revered', async () => {
    expect(new AssertionEvaluator().evaluate({
      value: '4.0.0',
      assertion: '4.0.0 >= > 3.0.0',
    })).toBe(true);
  });
});
