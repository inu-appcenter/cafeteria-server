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

class AssertionEvaluator {
  constructor(logging = true) {
    this.supportedOperations = ['==', '&&', '<=', '>=', '<', '>']; // Longest first!
    this.versionSymbleName = 'VERSION';
    this.logging = logging;
  }

  evaluate({value, assertion}) {
    if (assertion === '*' || assertion === '' || assertion === null || assertion === undefined) {
      return true;
    }

    this.value = value;
    this.assertion = assertion;

    this._preprocess();
    if (this.logging) console.log(`Preprocessed: ${this.assertion}`);

    this._inline();
    if (this.logging) console.log(`Inlined: ${this.assertion}`);

    return eval(this.assertion);
  }

  _preprocess() {
    this._normalize();
    this._fillMissingOperandIfNeeded();
  }

  /**
   * Make it understandable for javascript.
   * '4.0.0' to '== 4.0.0' and '3.0.0 < VERSION < 4.0.0' to '3.0.0 < VERSION && VERSION && 4.0.0'
   * @private
   */
  _normalize() {
    const numberOfOperators = this._getNumberOfOperators();

    if (numberOfOperators === 0) {
      // Single constant.
      this.assertion = '== ' + this.assertion;
    } else if (numberOfOperators > 0) {
      const regexToSplitAssertion = new RegExp(`(${this.supportedOperations.join('|')})`);
      const split = this.assertion.split(regexToSplitAssertion).map((el) => el.trim());

      /**
       *  a < b < c             2
       *  a < b && b < c         2
       *
       *  a < b < c < d             3
       *  a < b && b < c && c < d      3
       *  0 1 2 && 2 3 4 && 4 5 6
       */

      const singleComparisons = [];
      for (let i = 0; i < numberOfOperators; i++) {
        singleComparisons.push(split.slice(i * 2, i * 2 + 3).join(' '));
      }

      this.assertion = singleComparisons.join(' && ');
    }
  }

  _getNumberOfOperators() {
    const isOperator = (token) => this.supportedOperations.indexOf(token) > -1;

    return this.assertion.split(' ').filter((token) => isOperator(token)).length;
  }

  /**
   * Change '< 4.0.0' to '${operandName} < 4.0.0'.
   * @private
   */
  _fillMissingOperandIfNeeded() {
    const regexToSplitAssertion = new RegExp(`(${this.supportedOperations.join('|')})`);
    const split = this.assertion.split(regexToSplitAssertion).map((el) => el.trim());

    this.assertion = split.map((el) => (el === '') ? this.versionSymbleName : el).join(' ');
  }

  /**
   * Replace symbol with constant.
   * @private
   */
  _inline() {
    this.assertion = this._replaceAll(this.assertion, this.versionSymbleName, this.value);

    this._escapeAssertion();
  }

  _replaceAll(str, searchStr, replaceStr) {
    return str.split(searchStr).join(replaceStr);
  }

  /**
   * Escape 4.0.0 to '4.0.0'.
   * @private
   */
  _escapeAssertion() {
    const tokens = this.assertion.split(' ').map((el) => el.trim());

    const isOperator = (token) => this.supportedOperations.indexOf(token) > -1;
    const isSymbol = (token) => this.versionSymbleName === token;
    const isEscaped = (token) => token.toString().startsWith('\'') && token.toString().endsWith('\'');

    const constantEscapedTokens = tokens.map((token) =>
      (isOperator(token) || isSymbol(token) || isEscaped(tokens)) ? token : `'${token}'`);

    this.assertion = constantEscapedTokens.join(' ');
  }
}

export default AssertionEvaluator;
