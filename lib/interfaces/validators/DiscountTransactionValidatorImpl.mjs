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
import bcrypt from 'bcrypt';

/**
 * This class is responsible for validating a discount transaction request.
 */
class DiscountTransactionValidatorImpl extends DiscountTransactionValidator {
  constructor({transactionRepository, userRepository}) {
    super();

    this.transactionRepository = transactionRepository;
    this.userRepository = userRepository;
  }

  // Rule of cafeteria
  async isInMealTime(cafeteriaId, mealType/* 0 or 1 or 2 */) {
    const cafeteriaRule = await this.transactionRepository
        .getCafeteriaDiscountRuleByCafeteriaId(cafeteriaId);

    // availableMealTypes of the cafeteriaRule comes in octet form.
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
      return !!((2**a) & b);
    };

    return isAInB(mealType, cafeteriaRule.availableMealTypes);
  }

  // Rule of user
  async userExists(userId) {
    const user = await this.userRepository.getUserById(userId);

    return !!user;
  }

  // Rule of user
  async isBarcodeActive(userId, activeDurationMinute/* in minutes */) {
    const userStatus = await this.transactionRepository
        .getUserDiscountStatusByUserId(userId);

    const neverActivated = !userStatus.lastBarcodeActivation;
    if (neverActivated) {
      return false;
    }

    const now = moment();
    const past = moment(userStatus.lastBarcodeActivation);
    const recentlyActivated = now.diff(past, 'minutes') < activeDurationMinute;

    return !!recentlyActivated; /* should be recently activated */
  }

  // Rule of user
  async isFirstToday(userId) {
    const transactionsToday = await this.transactionRepository
        .getAllTransactionsOfUserToday(userId);

    return transactionsToday.length === 0;
  }

  // Rule of user
  async barcodeNotUsedRecently(userId, intervalSec) {
    const userStatus = await this.transactionRepository
        .getUserDiscountStatusByUserId(userId);

    const neverUsed = !userStatus.lastBarcodeTagging;
    if (neverUsed) {
      return true;
    }

    const now = moment();
    const past = moment(userStatus.lastBarcodeTagging);
    const recentlyUsed = now.diff(past, 'seconds') < intervalSec;

    return !recentlyUsed; /* should not be used recently */
  }

  // Rule of cafeteria
  async isTokenValid(cafeteriaId, plainToken) {
    const cafeteriaRule = await this.transactionRepository
        .getCafeteriaDiscountRuleByCafeteriaId(cafeteriaId);

    if (!cafeteriaRule) {
      return false;
    }

    const hashedToken = cafeteriaRule.token;

    return config.hash.saltRounds ?
        bcrypt.compare(plainToken, hashedToken) :
        (plainToken === hashedToken);
  }
}

export default DiscountTransactionValidatorImpl;
