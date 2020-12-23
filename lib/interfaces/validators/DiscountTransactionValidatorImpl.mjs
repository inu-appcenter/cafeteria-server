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

  async requestShouldBeInMealTime(cafeteriaId, mealType/* -1 or 0 or 1 or 2 */) {
    if (!cafeteriaId || mealType === null || mealType === undefined) {
      return false;
    }

    if (!(mealType in [0, 1, 2])) {
      return false;
    }

    const validationParams = await this.transactionRepository
      .getCafeteriaValidationParamsByCafeteriaId(cafeteriaId);

    if (!validationParams) {
      logger.warn('no validation params!');
      return false;
    }

    // availableMealTypes of the validationParams comes in octet form.
    // mealType is one of [0, 1, 2], each representing breakfast, lunch,
    // and dinner.
    //
    // These combinations are possible:
    //  breakfast only -> 1 (2^0)
    //  lunch only -> 2 (2^1)
    //  dinner only -> 4 (2^2)
    //  lunch and dinner -> 6 (2^1 + 2^2)
    //  ...and 2^3 - 4 others.
    const isAInB = (a, b) => {
      return !!((2 ** a) & b);
    };

    // Specified meal type must be supported by cafeteria.
    const mealTypeSupportedByCafeteria = isAInB(mealType, validationParams.availableMealTypes);
    if (!mealTypeSupportedByCafeteria) {
      logger.warn(`mealType ${mealType}(of 0, 1, 2) is not supported by cafeteria ${cafeteriaId}(availableMealTypes: ${validationParams.availableMealTypes})`);
      return false;
    }

    // Meal type must be valid (if the time is 23:00 and the meal type indicates breakfast by zero, it is not valid).
    const nowInTimeRange = this._isMealTypeTruthful(mealType, validationParams);
    if (!nowInTimeRange) {
      logger.warn(`current time ${new Date()} is not in time range ${validationParams.timeRanges}.`);
      return false;
    }

    return true;
  }

  _isMealTypeTruthful(mealType, validationParams) {
    const timeRanges = validationParams.timeRanges;
    const timeRangeOfGivenMealType = [timeRanges.breakfast, timeRanges.lunch, timeRanges.dinner][mealType];

    return timeUtil.isTimeInRange(timeRangeOfGivenMealType);
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
