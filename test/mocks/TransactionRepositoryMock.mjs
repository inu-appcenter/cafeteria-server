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
    this.userDiscountStatus = new Map();
    this.cafeteriaDiscountRule = new Map();

    this.userTransactionsToday = new Map();
    this.barcodeState = new Map();
    this.lastBarcodeTagged = new Map();
  }

  getUserDiscountStatusByUserId(userId) {
    return this.userDiscountStatus.get(userId);
  }

  getCafeteriaDiscountRuleByCafeteriaId(cafeteriaId) {
    return this.cafeteriaDiscountRule.get(cafeteriaId);
  }

  getAllTransactionsOfUserToday(userId) {
    return this.userTransactionsToday.get(userId) || [];
  }

  activateBarcode(userId) {
    this.barcodeState.set(userId, true);
  }

  updateBarcodeTagTime(userId) {
    this.lastBarcodeTagged.set(userId, new Date());
  }

  writeDiscountTransaction(transaction) {
    this.userTransactionsToday.set(transaction.userId, transaction);
  }

  removeDiscountTransaction(transaction) {
    this.userTransactionsToday.delete(transaction.userId);
  }
}

export default TransactionRepositoryMock;
