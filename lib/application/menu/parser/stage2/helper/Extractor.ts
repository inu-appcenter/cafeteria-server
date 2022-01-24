/**
 * This file is part of INU Cafeteria.
 *
 * Copyright 2021 INU Global App Center <potados99@gmail.com>
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

import {logger} from '@inu-cafeteria/backend-core';
import LineClassifier, {RegexResult} from './LineClassifier';

/**
 * 주어진 하나의 식단 스트링 뭉치에서
 * 메뉴, 가격, 열량, 기타 정보를 끄집어냅니다.
 */
export default class Extractor {
  private classifiers = {
    extras: new LineClassifier(/^\*+\s*(?<EXTRA>.+)$/),
    foods: new LineClassifier(/^(?<FOOD>.+)$/),
    prices: new LineClassifier(/^(?<PRICE>[0-9,]+)원$/),
    calories: new LineClassifier(/^(?<CALORIE>[0-9,]+)[Kk]cal$/),
  };

  constructor(private readonly text: string) {
    this.classifyLines();
  }

  private classifyLines() {
    logger.verbose(`<메뉴 파싱 stage 2> 먼저 각 줄들을 food, price, calorie, extra로 분류합니다.`);

    const lines = this.text
      .split('\n')
      .filter((line) => line.length > 0)
      .map((line) => line.trim());

    for (const line of lines) {
      /**
       * 가장 좁은 것부터 매치합니다.
       * 위에서 매치되지 않았으면 아래로 내려갑니다.
       *
       * 현재는 상세 정보(extra)인지 가장 먼저 보고,
       * 그 다음에 가격(price)과 열량(calorie)인지 보고,
       * 그 다음 모든 것들은 메뉴 정보(foods)라고 간주합니다.
       */
      this.classifiers.extras.captureIfMatches(line) ||
        this.classifiers.prices.captureIfMatches(line) ||
        this.classifiers.calories.captureIfMatches(line) ||
        this.classifiers.foods.captureIfMatches(line);
    }

    logger.verbose(
      `<메뉴 파싱 stage 2> ` +
        `foods ${this.classifiers.foods.getCapturedResults().length}개, ` +
        `prices ${this.classifiers.prices.getCapturedResults().length}개,` +
        `calories ${this.classifiers.calories.getCapturedResults().length}개, ` +
        `extras ${this.classifiers.extras.getCapturedResults().length}개 분류 완료.`
    );
  }

  extractExtras(): string[] {
    return this.classifiers.extras
      .getCapturedResults()
      .map((result) => this.getStringPropertySafely(result, 'EXTRA')) as string[];
  }

  extractFoods(): string[] {
    return this.classifiers.foods
      .getCapturedResults()
      .map((result) => this.getStringPropertySafely(result, 'FOOD')) as string[];
  }

  extractPrice(): number | undefined {
    const prices = this.classifiers.prices
      .getCapturedResults()
      .map((result) => this.getNumberPropertySafely(result, 'PRICE')) as number[];

    if (prices.length > 1) {
      logger.warn(`하나의 메뉴에 가격 정보가 두 개 이상 들어 있습니다: ${this.text}`);
    }

    return prices.pop();
  }

  extractCalorie(): number | undefined {
    const calories = this.classifiers.calories
      .getCapturedResults()
      .map((result) => this.getNumberPropertySafely(result, 'CALORIE')) as number[];

    if (calories.length > 1) {
      logger.warn(`하나의 메뉴에 칼로리 정보가 두 개 이상 들어 있습니다: ${this.text}`);
    }

    return calories.pop();
  }

  private getStringPropertySafely(matchedResult: RegexResult, propName: string) {
    return matchedResult?.groups?.[propName];
  }

  private getNumberPropertySafely(matchedResult: RegexResult, propName: string) {
    const valueString = this.getStringPropertySafely(matchedResult, propName);
    if (valueString == null) {
      return null;
    }

    const withoutComma = valueString.replace(',', '');

    return Number.parseInt(withoutComma);
  }
}
