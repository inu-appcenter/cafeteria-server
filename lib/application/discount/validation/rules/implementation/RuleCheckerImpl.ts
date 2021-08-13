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

import RuleChecker from '../RuleChecker';
import {Cafeteria, DiscountTransaction, User} from '@inu-cafeteria/backend-core';
import MealTypeValidator from './MealTypeValidator';
import moment from 'moment';

class RuleCheckerImpl implements RuleChecker {
  async requestShouldBeNotMalformed({
    studentId,
    cafeteriaId,
    mealType,
  }: DiscountTransaction): Promise<boolean> {
    return !(studentId == null || cafeteriaId == null || mealType == null);
  }

  async cafeteriaShouldSupportDiscount(cafeteriaId: number): Promise<boolean> {
    const cafeteria = await Cafeteria.findOne(cafeteriaId, {
      relations: ['discountValidationParams'],
    });

    if (cafeteria == null) {
      return false;
    }

    if (!cafeteria.supportDiscount) {
      return false;
    }

    if (cafeteria.discountValidationParams == null) {
      return false;
    }

    return false;
  }

  async requestShouldBeInMealTime(cafeteriaId: number, mealType: number): Promise<boolean> {
    const cafeteria = await Cafeteria.findOne(cafeteriaId, {
      relations: ['discountValidationParams'],
    });

    if (cafeteria == null) {
      return false;
    }

    if (cafeteria.discountValidationParams == null) {
      return false;
    }

    const {discountValidationParams} = cafeteria;

    return new MealTypeValidator({
      mealType,
      discountValidationParams,
    }).shouldBeInMealTime();
  }

  async userShouldExist(studentId: string): Promise<boolean> {
    const user = await User.findOne({studentId});

    return user != null;
  }

  async barcodeShouldBeActive(studentId: string, activeDurationMinutes: number): Promise<boolean> {
    const user = await User.findOne({studentId});
    if (user == null) {
      return false;
    }

    const {barcodeActivatedAt} = user;
    if (barcodeActivatedAt == null) {
      return false; // 활성화된 적이 읎음!
    }

    const now = moment();
    const elapsed = now.diff(barcodeActivatedAt, 'minutes');

    return elapsed < activeDurationMinutes;
  }

  async barcodeShouldNotBeUsedRecently(studentId: string, intervalSec: number): Promise<boolean> {
    const user = await User.findOne({studentId});
    if (user == null) {
      return false;
    }

    const {barcodeTaggedAt} = user;
    if (barcodeTaggedAt == null) {
      return true; // 태그된 적이 읎음! true 반환해줌!
    }

    const now = moment();
    const elapsed = now.diff(barcodeTaggedAt, 'seconds');

    return elapsed >= intervalSec;
  }

  async discountAtThisCafeteriaShouldBeFirstToday(
    studentId: string,
    cafeteriaId: number
  ): Promise<boolean> {
    const transactionsToday = await DiscountTransaction.findTransactions(studentId, cafeteriaId);

    return transactionsToday.length === 0;
  }
}

export default new RuleCheckerImpl();
