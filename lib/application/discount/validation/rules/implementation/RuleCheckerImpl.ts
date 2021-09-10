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

import {logger} from '@inu-cafeteria/backend-core';
import moment from 'moment';
import RuleChecker from '../RuleChecker';
import MealTypeValidator from './MealTypeValidator';
import {Cafeteria, DiscountTransaction, User} from '@inu-cafeteria/backend-core';

/**
 * 할인 룰 체커의 구현체입니다.
 * 여기에서는 로그를 빵빵하게 출력해 주어야 합니다.
 */
class RuleCheckerImpl implements RuleChecker {
  async requestShouldBeNotMalformed({
    studentId,
    cafeteriaId,
    mealType,
  }: DiscountTransaction): Promise<boolean> {
    if (studentId == null) {
      logger.warn(`잘못된 요청입니다. 학번(studentId)이 존재하지 않습니다.`);
      return false;
    }

    if (cafeteriaId == null) {
      logger.warn(`잘못된 요청입니다. 식당 식별자(cafeteriaId)가 존재하지 않습니다.`);
      return false;
    }

    if (mealType == null) {
      logger.warn(`잘모소딘 요청입니다. 식사 시간대(mealType)가 존재하지 않습니다.`);
      return false;
    }

    return true;
  }

  async cafeteriaShouldSupportDiscount(cafeteriaId: number): Promise<boolean> {
    const cafeteria = await Cafeteria.findOne(cafeteriaId, {
      relations: ['discountValidationParams'],
    });

    if (cafeteria == null) {
      logger.warn(`id가 ${cafeteriaId}인 해당 학식당을 찾을 수 없습니다.`);
      return false;
    }

    if (!cafeteria.supportDiscount) {
      logger.warn(`${cafeteria.name}은(는) 할인을 지원하지 않습니다.`);
      return false;
    }

    if (cafeteria.discountValidationParams == null) {
      logger.warn(`${cafeteria.name}에 연결된 할인 검증 파라미터가 존재하지 않습니다.`);
      return false;
    }

    return true;
  }

  async requestShouldBeInMealTime(cafeteriaId: number, mealType: number): Promise<boolean> {
    const cafeteria = await Cafeteria.findOne(cafeteriaId, {
      relations: ['discountValidationParams'],
    });

    if (cafeteria == null) {
      logger.warn(`id가 ${cafeteriaId}인 해당 학식당을 찾을 수 없습니다.`);
      return false;
    }

    const {discountValidationParams} = cafeteria;

    if (discountValidationParams == null) {
      logger.warn(`${cafeteria.name}에 연결된 할인 검증 파라미터가 존재하지 않습니다.`);
      return false;
    }

    return new MealTypeValidator({
      mealType,
      discountValidationParams,
    }).shouldBeInMealTime();
  }

  async userShouldExist(studentId: string): Promise<boolean> {
    const user = await User.findOne({studentId});

    if (user == null) {
      logger.warn(`학번이 ${studentId}인 학생은 존재하지 않습니다.`);
      return false;
    }

    return true;
  }

  async barcodeShouldBeActive(studentId: string, activeDurationMinutes: number): Promise<boolean> {
    const user = await User.findOne({studentId});

    if (user == null) {
      logger.warn(`학번이 ${studentId}인 학생은 존재하지 않습니다.`);
      return false;
    }

    const {barcodeActivatedAt} = user;

    if (barcodeActivatedAt == null) {
      logger.warn(`학번이 ${studentId}인 사용자의 바코드가 활성화된 적이 없습니다.`);
      return false; // 활성화된 적이 읎음!
    }

    const now = moment();
    const elapsed = now.diff(barcodeActivatedAt, 'minutes');

    if (elapsed > activeDurationMinutes) {
      logger.warn(
        `학번이 ${studentId}인 사용자의 바코드가 활성화 후 ${activeDurationMinutes}분이 지나 비활성되었습니다.`
      );
      return false;
    }

    return true;
  }

  async barcodeShouldNotBeUsedRecently(studentId: string, intervalSec: number): Promise<boolean> {
    const user = await User.findOne({studentId});

    if (user == null) {
      logger.warn(`학번이 ${studentId}인 학생은 존재하지 않습니다.`);
      return false;
    }

    const {barcodeTaggedAt} = user;

    if (barcodeTaggedAt == null) {
      logger.info(
        `학번이 ${studentId}인 사용자의 바코드가 활성화된 적이 없으므로 최근 바코드 사용도 없는 것으로 간주합니다.`
      );
      return true; // 태그된 적이 읎음! true 반환해줌!
    }

    const now = moment();
    const elapsed = now.diff(barcodeTaggedAt, 'seconds');

    if (elapsed < intervalSec) {
      logger.warn(
        `학번이 ${studentId}인 사용자의 바코드가 다시 사용 가능해질 때까지 필요한 최소 시간(${intervalSec}초)이 아직 지나지 않았습니다.`
      );
      return false;
    }

    return true;
  }

  async discountAtThisCafeteriaShouldBeFirstToday(
    studentId: string,
    cafeteriaId: number
  ): Promise<boolean> {
    const transactionsToday = await DiscountTransaction.findTransactions(studentId, cafeteriaId);

    if (transactionsToday.length > 0) {
      logger.warn(
        `학번이 ${studentId}인 사용자가 오늘 이미 해당 식당(${cafeteriaId})에서 할인받은 기록이 있습니다.`
      );
      return false;
    }

    return true;
  }
}

export default new RuleCheckerImpl();
