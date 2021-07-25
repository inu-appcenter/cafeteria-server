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

export type RegexResult = RegExpExecArray | null;

export default class Matcher {
  constructor(private readonly text: string, private readonly expressions: string[]) {}

  longestMatch() {
    const results = this.expressions
      .map((exprString) => new RegExp(exprString))
      .map((expr) => expr.exec(this.text))
      .filter((result) => !!result);

    if (results.length > 0) {
      return results.reduce((prev, current) => this.chooseLongestMatch(prev, current));
    } else {
      return null;
    }
  }

  private chooseLongestMatch(one: RegexResult, another: RegexResult) {
    if (one == null && another == null) {
      return null;
    } else if (one == null) {
      return another;
    } else if (another == null) {
      return one;
    }

    return one[0].length < another[0].length ? another : one;
  }
}
