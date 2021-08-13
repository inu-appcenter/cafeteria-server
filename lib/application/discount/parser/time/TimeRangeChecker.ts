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

import moment from 'moment';
import logger from '../../../../common/logging/logger';
import MealType from '@inu-cafeteria/backend-core/dist/src/core/menu/MealType';
import {TimeRangeExpression} from '@inu-cafeteria/backend-core';

export default class TimeRangeChecker {
  constructor(
    private readonly breakfast: TimeRangeExpression,
    private readonly lunch: TimeRangeExpression,
    private readonly dinner: TimeRangeExpression
  ) {}

  getCurrentMealType(now = new Date()) {
    const {breakfast, lunch, dinner} = this;

    if (this.isTimeInRange(breakfast, now)) {
      return MealType.BREAKFAST;
    } else if (this.isTimeInRange(lunch, now)) {
      return MealType.LUNCH;
    } else if (this.isTimeInRange(dinner, now)) {
      return MealType.DINNER;
    } else {
      return MealType.NONE;
    }
  }

  private isTimeInRange(timeRangeString: string, now: Date) {
    const timeRangeStringValid = /^[0-2][0-9]:[0-5][0-9]-[0-2][0-9]:[0-5][0-9]$/.test(
      timeRangeString
    );

    if (!timeRangeStringValid) {
      logger.warn(`잘못된 시간 범위 문자열입니다: ${timeRangeString}`);

      return false;
    }

    const [start, end] = timeRangeString
      .split('-')
      .map((timeString) => moment(timeString, 'hh:mm'));

    return moment(now).isBetween(start, end, null, '[)');
  }
}
