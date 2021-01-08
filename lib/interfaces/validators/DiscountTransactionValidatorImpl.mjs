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

import DiscountTransactionValidator from '../../domain/validators/DiscountTransactionValidator';

import config from '../../../config';

import moment from 'moment';
import logger from '../../common/utils/logger';
import timeUtil from '../../common/utils/timeUtil';
import MealType from '../../domain/constants/MealType.js';

/**
 * This class is responsible for validating a discount transaction request.
 */
class DiscountTransactionValidatorImpl extends DiscountTransactionValidator {
  constructor({transactionRepository, cafeteriaRepository, userRepository, tokenManager}) {
    super();

    this.transactionRepository = transactionRepository;
    this.cafeteriaRepository = cafeteriaRepository;
    this.userRepository = userRepository;
    this.tokenManager = tokenManager;
  }

  async requestShouldBeNotMalformed(transaction) {
    if (!transaction) {
      logger.warn('transaction is invalid!');
      return false;
    }

    const {userId, cafeteriaId, mealType} = transaction;

    if (!userId || isNaN(userId) || userId < 0) {
      logger.warn(`userId of transaction is invalid: ${userId}`);
      return false;
    }

    if (!cafeteriaId || isNaN(cafeteriaId) || cafeteriaId < 0) {
      logger.warn(`cafeteriaId of transaction is invalid: ${cafeteriaId}`);
      return false;
    }

    // hey! mealType can be zero!
    if (mealType === null || mealType === undefined || isNaN(mealType)) {
      logger.warn(`mealType of transaction is invalid: ${mealType}`);
      return false;
    }

    return true;
  }

  async requestShouldBeInMealTime(cafeteriaId, mealType/* 0(error) or 4 or 2 or 1 */) {
    if (!cafeteriaId || !mealType) {
      return false;
    }

    if (!MealType.ALL_TYPES.includes(mealType)) {
      return false;
    }

    const validationParams = await this.transactionRepository.getCafeteriaValidationParamsByCafeteriaId(cafeteriaId);
    if (!validationParams) {
      logger.warn('No validation params!');
      return false;
    }

    // Specified meal type must be supported by cafeteria.
    const mealTypeSupportedByCafeteria = this._isMealTypeSupported(mealType, validationParams);
    if (!mealTypeSupportedByCafeteria) {
      logger.warn(`MealType ${mealType}(of 4, 2, 1) is not supported by cafeteria ${cafeteriaId}(availableMealTypes: ${validationParams.availableMealTypes})`);
      return false;
    }

    // Meal type must be valid (if the time is 23:00 and the meal type indicates breakfast by zero, it is not valid).
    const nowInTimeRange = this._isMealTypeTruthful(mealType, validationParams);
    if (!nowInTimeRange) {
      logger.warn(`Current time ${new Date()} is not in time range ${validationParams.timeRanges}.`);
      return false;
    }

    return true;
  }

  _isMealTypeSupported(mealType, validationParams) {
    return !!(mealType & validationParams.availableMealTypes);
  }

  _isMealTypeTruthful(mealType, validationParams) {
    const timeRanges = validationParams.timeRanges;

    // MealType -> time range
    switch (mealType) {
      case 4: return timeUtil.isTimeInRange(timeRanges.breakfast);
      case 2: return timeUtil.isTimeInRange(timeRanges.lunch);
      case 1: return timeUtil.isTimeInRange(timeRanges.dinner);
      default: return false;
    }
  }

  async cafeteriaShouldSupportDiscount(cafeteriaId) {
    if (!cafeteriaId) {
      return false;
    }

    const cafeteria = await this.cafeteriaRepository
      .getCafeteriaById(cafeteriaId);

    if (!cafeteria) {
      return false;
    }

    if (!cafeteria.supportDiscount) {
      return false;
    }

    const cafeteriaRule = await this.transactionRepository
      .getCafeteriaValidationParamsByCafeteriaId(cafeteriaId);

    return !!cafeteriaRule;
  }

  async userShouldExist(userId) {
    if (!userId) {
      return false;
    }

    const user = await this.userRepository.findUserById(userId);

    return !!user;
  }

  async barcodeShouldBeActive(userId, activeDurationMinute/* in minutes */) {
    if (!userId || !activeDurationMinute) {
      return false;
    }

    const userStatus = await this.transactionRepository
      .getUserDiscountStatusByUserId(userId);

    if (!userStatus) {
      return false;
    }

    const neverActivated = !userStatus.lastBarcodeActivation;
    if (neverActivated) {
      return false;
    }

    const now = moment();
    const past = moment(userStatus.lastBarcodeActivation);
    const recentlyActivated = now.diff(past, 'minutes') < activeDurationMinute;

    return !!recentlyActivated; /* should be recently activated */
  }

  async discountShouldBeFirstToday(userId) {
    if (!userId) {
      return false;
    }

    const transactionsToday = await this.transactionRepository
      .getAllTransactionsOfUserToday(userId);

    return transactionsToday.length === 0;
  }

  async barcodeShouldNotBeUsedRecently(userId, intervalSec) {
    if (!userId || !intervalSec || isNaN(intervalSec)) {
      return true;
    }

    const userStatus = await this.transactionRepository.getUserDiscountStatusByUserId(userId);
    if (!userStatus) {
      return true;
    }

    const neverUsed = !userStatus.lastBarcodeTagging;
    if (neverUsed) {
      return true;
    }

    const now = moment();
    const past = moment(userStatus.lastBarcodeTagging);
    const recentlyUsed = now.diff(past, 'seconds') < intervalSec;

    return !recentlyUsed; /* should not be used recently */
  }

  async tokenShouldBeValid(cafeteriaId, plainToken) {
    if (!cafeteriaId || isNaN(cafeteriaId) || !plainToken) {
      return false;
    }

    const cafeteriaRule = await this.transactionRepository
      .getCafeteriaValidationParamsByCafeteriaId(cafeteriaId);

    if (!cafeteriaRule) {
      return false;
    }

    const hashedToken = cafeteriaRule.token;

    return config.hash.saltRounds ?
      this.tokenManager.compareBcryptToken(plainToken, hashedToken) :
      (plainToken === hashedToken);
  }
}

export default DiscountTransactionValidatorImpl;
