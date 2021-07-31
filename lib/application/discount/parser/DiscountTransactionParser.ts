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

import {HandleDiscountTransactionParams} from '../common/Types';
import {
  Cafeteria,
  CafeteriaValidationParams,
  DiscountTransaction,
  User,
} from '@inu-cafeteria/backend-core';
import {RequestMalformed} from '../common/Errors';
import assert from 'assert';
import TimeRangeChecker from './time/TimeRangeChecker';

export default class DiscountTransactionParser {
  constructor(private readonly params: HandleDiscountTransactionParams) {}

  async parse(): Promise<DiscountTransaction> {
    return {
      mealType: await this.getCurrentMealTypeForThisCafeteria(),
      studentId: await this.getStudentId(),
      cafeteriaId: await this.getValidatedCafeteriaId(),
    };
  }

  /**
   * 이 카페테리아에서, 지금 시간은 아침일까, 점심일까, 아니면 저녁일까?
   */
  private async getCurrentMealTypeForThisCafeteria(): Promise<number> {
    const {cafeteriaId} = this.params;

    const validationParams = await CafeteriaValidationParams.findOne({cafeteriaId});
    const timeRanges = validationParams?.timeRanges;

    return new TimeRangeChecker(timeRanges).getCurrentMealType();
  }

  /**
   * 바코드로부터 사용자를 가져와서, 그 사용자의 학번을 구합니다.
   * 바코드가 이상하거나 그 사용자에게 학번이 없으면? 펑.
   */
  private async getStudentId(): Promise<string> {
    const {barcode} = this.params;

    const user = await User.findOne({barcode});

    assert(user, RequestMalformed());
    assert(user.studentId, RequestMalformed());

    return user.studentId;
  }

  /**
   * 카페테리아 식별자를 가져오는데, 실제로 존재하는 카페테리아인 경우에만.
   * 아니면? 펑.
   */
  private async getValidatedCafeteriaId(): Promise<number> {
    const {cafeteriaId} = this.params;

    const cafeteria = await Cafeteria.findOne(cafeteriaId);

    assert(cafeteria, RequestMalformed());

    return cafeteria.id;
  }
}
