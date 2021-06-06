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

import VersionAssertionEvaluator from '../../../../lib/common/utils/VersionAssertionEvaluator.mjs';

describe('# Evaluate', () => {
  it('should support wildcard', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.0.0',
      assertion: '*',
    })).toBe(true);
  });

  it('should support eq', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.0.0',
      assertion: '4.0.0',
    })).toBe(true);
  });

  it('should support lt', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.0.0',
      assertion: '<4.0.0',
    })).toBe(false);
  });

  it('should support le', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.0.0',
      assertion: '<=4.0.0',
    })).toBe(true);
  });

  it('should support gt', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.0.0',
      assertion: '>4.0.0',
    })).toBe(false);
  });

  it('should support ge', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.0.0',
      assertion: '>=4.0.0',
    })).toBe(true);
  });

  it('should support ge with prerelease', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.0.0',
      assertion: '>=4.0.0-beta.1',
    })).toBe(true);
  });

  it('should support ge with prerelease (2)', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.0.0',
      assertion: '<=4.0.0-beta.1',
    })).toBe(false);
  });

  it('should support ge with prerelease (3)', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.0.0-beta.1',
      assertion: '<=4.0.0-beta.1',
    })).toBe(true);
  });

  it('should support ge with prerelease (4)', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.0.0-beta.2',
      assertion: '<=4.0.0-beta.1',
    })).toBe(false);
  });

  it('should think release is bigger than prerelease', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.0.0',
      assertion: '>=4.0.0-beta.999',
    })).toBe(true);
  });

  it('should think release is bigger than prerelease (2)', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.0.0',
      assertion: '<=4.0.0-beta.999',
    })).toBe(false);
  });

  it('should exclude prerelease on comparison with release', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.0.0-beta.3',
      assertion: '>=4.0.0',
    })).toBe(false);
  });

  it('should support specifying beta of a single version', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.0.0-beta.0',
      assertion: '>4.0.0-beta <4.0.0',
    })).toBe(true);
  });

  it('should support specifying beta of a single version (2)', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.0.0-beta.0',
      assertion: '>=4.0.0-beta <4.0.0',
    })).toBe(true);
  });

  it('should support range comparison', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.0.0',
      assertion: '>3.0.0 <=4.0.0',
    })).toBe(true);
  });

  it('should support range comparison revered', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.0.0',
      assertion: '<=4.0.0 >3.0.0',
    })).toBe(true);
  });

  it('should support tilde version (1)', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.5.0',
      assertion: '~4.5.0',
    })).toBe(true);
  });

  it('should support tilde version (2)', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.5.1',
      assertion: '~4.5.0',
    })).toBe(true);
  });

  it('should support tilde version (3)', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.6.0',
      assertion: '~4.5.0',
    })).toBe(false);
  });

  it('should support tilde version with prerelease', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.5.3-beta.36',
      assertion: '~4.5.1-beta',
    })).toBe(true);
  });

  it('should support tilde version with prerelease (2)', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.5.1-beta.36',
      assertion: '^4.5.1-beta',
    })).toBe(true);
  });

  it('should support tilde version with prerelease (3)', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.5.1-beta.36',
      assertion: '4.5.1-beta',
    })).toBe(false);
  });

  it('should support tilde version with prerelease (4)', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.5.1-beta.36',
      assertion: '4.5.1-beta.x',
    })).toBe(false);
  });

  it('should support tilde version with prerelease (5)', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.0.1',
      assertion: '~4.0.0-beta.999',
    })).toBe(true);
  });

  it('should support tilde version with prerelease (6)', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.0.1-beta.999',
      assertion: '~4.0.0',
    })).toBe(true);
  });

  it('should support caret version', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.5.1',
      assertion: '^4.5.1',
    })).toBe(true);
  });

  it('should support caret version (2)', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '4.6.1',
      assertion: '^4.5.1',
    })).toBe(true);
  });

  it('should support caret version (3)', async () => {
    expect(new VersionAssertionEvaluator().evaluate({
      value: '5.6.1',
      assertion: '^4.5.1',
    })).toBe(false);
  });
});
