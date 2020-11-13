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

import TransactionRepository from '../../lib/domain/repositories/TransactionRepository';

class TransactionRepositoryMock extends TransactionRepository {
  constructor() {
    super();
  }

  getDiscountRule(ruleId) {
    return null;
  }

  getUserDiscountStatusByUserId(userId) {
    throw new Error('Not mocked! You need extra mock');
  }

  getCafeteriaValidationParamsByCafeteriaId(cafeteriaId) {
    const params = [
      {
        cafeteriaId: 3, /* 사범대 */
        token: '$2b$09$im4EsvdDUMEP00/MqJ0fOe2hgCufZbHjwPr51nyVTK3KfjWXse9HW', // bcrypt hashed
        availableMealTypes: 2 | 4, /* launch and dinner only */
        timeRanges: {
          breakfast: '08:30-11:00',
          lunch: '11:00-14:10',
          dinner: '16:30-23:40',
        },
      },
      {
        cafeteriaId: 4, /* 제1기숙사식당 */
        token: '$2b$09$7gXIej4V7ZAu8fPSDiEVVOBOKiLEBKJkumHONkIECver4EW829pZ2', // bcrypt hashed
        availableMealTypes: 1, /* breakfast only */
        timeRanges: {
          breakfast: '08:30-11:00',
          lunch: '11:00-14:10',
          dinner: '16:30-23:40',
        },
      },
    ];

    return params.find((param) => param.cafeteriaId === cafeteriaId);
  }

  getAllTransactionsOfUserToday(userId) {
    throw new Error('Not mocked! You need extra mock');
  }

  activateBarcode(userId) {
    // do nothing
  }

  updateBarcodeTagTime(userId) {
    // do nothing
  }

  writeDiscountTransaction(transaction) {
    // do nothing
  }

  removeDiscountTransaction(transaction) {
    // do nothing
  }
}

export default TransactionRepositoryMock;
