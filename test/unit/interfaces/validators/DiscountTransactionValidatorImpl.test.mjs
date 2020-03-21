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

import resolve, {init} from '../../../../lib/common/di/resolve';
import testModules from '../../../testModules';
import DiscountTransactionValidator from '../../../../lib/domain/validators/DiscountTransactionValidator';
import DiscountTransaction from '../../../../lib/domain/entities/DiscountTransaction';
import CafeteriaDiscountRule from '../../../../lib/domain/entities/CafeteriaDiscountRule';
import Cafeteria from '../../../../lib/domain/entities/Cafeteria';
import User from '../../../../lib/domain/entities/User';
import UserDiscountStatus from '../../../../lib/domain/entities/UserDiscountStatus';

beforeAll(async () => {
  await init(testModules);
});

describe('# isNotMalformed', () => {
  const transactionTest = async function(transaction, expectation) {
    const actual = await resolve(DiscountTransactionValidator).isNotMalformed(transaction);

    expect(actual).toBe(expectation);
  };

  it('should catch null transaction', async () => {
    await transactionTest(null, false);
  });

  it('should catch null mealType', async () => {
    await transactionTest(new DiscountTransaction({
      mealType: null,
      userId: 201701562,
      cafeteriaId: 1,
    }), false);
  });

  it('should catch negative mealType', async () => {
    await transactionTest(new DiscountTransaction({
      mealType: -2,
      userId: 201701562,
      cafeteriaId: 1,
    }), false);
  });

  it('should catch null userId', async () => {
    await transactionTest(new DiscountTransaction({
      mealType: 1,
      userId: null,
      cafeteriaId: 1,
    }), false);
  });

  it('should catch zero userId', async () => {
    await transactionTest(new DiscountTransaction({
      mealType: 1,
      userId: 0,
      cafeteriaId: 1,
    }), false);
  });

  it('should catch negative userId', async () => {
    await transactionTest(new DiscountTransaction({
      mealType: 1,
      userId: -23,
      cafeteriaId: 1,
    }), false);
  });

  it('should catch null cafeteriaId', async () => {
    await transactionTest(new DiscountTransaction({
      mealType: 1,
      userId: 201701562,
      cafeteriaId: null,
    }), false);
  });

  it('should catch zero cafeteriaId', async () => {
    await transactionTest(new DiscountTransaction({
      mealType: 1,
      userId: 201701562,
      cafeteriaId: 0,
    }), false);
  });

  it('should catch negative cafeteriaId', async () => {
    await transactionTest(new DiscountTransaction({
      mealType: 1,
      userId: 201701562,
      cafeteriaId: -90,
    }), false);
  });
});

describe('# isInMealTime', () => {
  const setCafeteriaRule = function(cafeteriaId, token, availableMealTypes) {
    resolve(DiscountTransactionValidator)
      .transactionRepository
      .cafeteriaDiscountRule
      .set(cafeteriaId, new CafeteriaDiscountRule({
        token: token,
        availableMealTypes: availableMealTypes, // lunch only,
        cafeteriaId: cafeteriaId,
      }));
  };

  const mealTimeTest = async function(cafeteriaId, mealType, expectation) {
    const actual = await resolve(DiscountTransactionValidator).isInMealTime(cafeteriaId, mealType);

    expect(actual).toBe(expectation);
  };

  it('should catch null cafeteriaId in param', async () => {
    await mealTimeTest(null, 1, false);
  });

  it('should catch negative cafeteriaId in param', async () => {
    await mealTimeTest(-2, 1, false);
  });

  it('should catch null mealType in param', async () => {
    await mealTimeTest(3, null, false);
  });

  it('should ensure that cafeteria with id 1 support meal type 1', async () => {
    setCafeteriaRule(1, 'token', 2 /* lunch */);
    await mealTimeTest(1, 1, true);
  });

  it('should ensure that cafeteria with id 2 support meal type 0 and 2', async () => {
    setCafeteriaRule(2, 'token', 1 + 4 /* breakfast and dinner */);
    await mealTimeTest(2, 0, true);
    await mealTimeTest(2, 2, true);
  });
});

describe('# cafeteriaSupportsDiscount', () => {
  const setCafeteria = function(id,
                                name,
                                imagePath,
                                supportMenu,
                                supportDiscount,
                                supportNotification) {
    resolve(DiscountTransactionValidator)
      .cafeteriaRepository
      .cafeteria
      .set(id, new Cafeteria({
        id: id,
        name: name,
        imagePath: imagePath,
        supportMenu: supportMenu,
        supportDiscount: supportDiscount,
        supportNotification: supportNotification,
      }));
  };

  const setCafeteriaRule = function(cafeteriaId, token, availableMealTypes) {
    resolve(DiscountTransactionValidator)
      .transactionRepository
      .cafeteriaDiscountRule
      .set(cafeteriaId, new CafeteriaDiscountRule({
        token: token,
        availableMealTypes: availableMealTypes, // lunch only,
        cafeteriaId: cafeteriaId,
      }));
  };

  const discountSupportTest = async function(cafeteriaId, expectation) {
    const actual = await resolve(DiscountTransactionValidator).cafeteriaSupportsDiscount(cafeteriaId);

    expect(actual).toBe(expectation);
  };

  it('should catch null cafeteria id', async () => {
    await discountSupportTest(null, false);
  });

  it('should catch crazy cafeteria id', async () => {
    await discountSupportTest(9872934, false);
  });

  it('should say this cafeteria does not support discount', async () => {
    setCafeteria(1, 'cafeteria', 'path', true, false, true);
    await discountSupportTest(1, false);
  });

  it('should say this cafeteria supports discount but has no discount rule', async () => {
    setCafeteria(5, 'cafeteria', 'path', true, true, true);
    await discountSupportTest(5, false);
  });

  it('should say this cafeteria supports discount and has discount rule', async () => {
    setCafeteria(3, 'cafeteria', 'path', true, true, true);
    setCafeteriaRule(3, 'token', 1 + 2 + 4);
    await discountSupportTest(3, true);
  });
});

describe('# userExists', () => {
  const setUser = function(id, token, barcode) {
    resolve(DiscountTransactionValidator)
      .userRepository
      .users
      .set(id, new User({
        id: id,
        token: token,
        barcode: barcode,
      }));
  };

  const userTest = async function(userId, expectation) {
    const actual = await resolve(DiscountTransactionValidator).userExists(userId);

    expect(actual).toBe(expectation);
  };

  it('should catch null userId', async () => {
    await userTest(null, false);
  });

  it('should catch non existing userId', async () => {
    await userTest(2485728937, false);
  });

  it('should say a user exists', async () => {
    setUser(201701562, 'token', 'barcode');
    await userTest(201701562, true);
  });
});

describe('# isBarcodeActive', () => {
  const setUserState = function(userId, lastBarcodeActivation, lastBarcodeTagging) {
    resolve(DiscountTransactionValidator)
      .transactionRepository
      .userDiscountStatus
      .set(userId, new UserDiscountStatus({
        userId: userId,
        lastBarcodeActivation: lastBarcodeActivation,
        lastBarcodeTagging: lastBarcodeTagging,
      }));
  };

  const activationTest = async function(userId, duration, expectation) {
    const actual = await resolve(DiscountTransactionValidator).isBarcodeActive(userId, duration);

    expect(actual).toBe(expectation);
  };

  it('should catch null userId', async () => {
    await activationTest(null, 10, false);
  });

  it('should catch crazy userId', async () => {
    await activationTest(248935983, 10, false);
  });

  it('should catch null activeDurationMinute', async () => {
    await activationTest(1, null, false);
  });

  it('should say user status exists but barcode is never active', async () => {
    setUserState(201701562, null, null);
    await activationTest(201701562, 10, false);
  });

  it('should say user status exists but barcode is expired', async () => {
    const todayMorning = new Date();
    todayMorning.setHours(8, 25, 0);

    setUserState(201701562, todayMorning, null);
    await activationTest(201701562, 10, false);
  });

  it('should say barcode is active', async () => {
    const now = new Date();

    setUserState(201701562, now, null);
    await activationTest(201701562, 10, true);
  });
});

describe('# isFirstToday', () => {
  const addTransaction = function(userId, mealType, cafeteriaId) {
    resolve(DiscountTransactionValidator)
      .transactionRepository
      .userTransactionsToday
      .set(userId, new DiscountTransaction({
        userId: userId,
        mealType: mealType,
        cafeteriaId: cafeteriaId,
      }));
  };

  const firstTest = async function(userId, expectation) {
    const actual = await resolve(DiscountTransactionValidator).isFirstToday(userId);

    expect(actual).toBe(expectation);
  };

  it('should catch null userId in param', async () => {
    await firstTest(null, false);
  });

  it('should catch crazy userId in param', async () => {
    await firstTest(86756, true); // this is a right behavior
  });

  it('should say this user already made a transaction today', async () => {
    addTransaction(201701562, 2, 1);
    await firstTest(201701562, false);
  });
});
