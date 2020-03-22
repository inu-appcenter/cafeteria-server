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

import TransactionRepositoryImpl from '../../../../lib/interfaces/storage/TransactionRepositoryImpl';
import sequelize from '../../infrastructure/database/sequelizeMock';
import DiscountTransaction from '../../../../lib/domain/entities/DiscountTransaction';

describe('# getUserDiscountStatusByUserId', () => {
  it('should catch null id', async () => {
    const repo = getRepository();
    const result = await repo.getUserDiscountStatusByUserId(null);

    expect(result).toBeNull();
  });

  it('should work', async () => {
    const repo = getRepository();
    const result = await repo.getUserDiscountStatusByUserId(201701562);

    expect(result).toHaveProperty('userId');
    expect(result).toHaveProperty('lastBarcodeActivation');
    expect(result).toHaveProperty('lastBarcodeTagging');
  });
});

describe('# getCafeteriaDiscountRuleByCafeteriaId', () => {
  it('should catch null id', async () => {
    const repo = getRepository();
    const result = await repo.getCafeteriaDiscountRuleByCafeteriaId(null);

    expect(result).toBeNull;
  });

  it('should work', async () => {
    const repo = getRepository();
    const result = await repo.getCafeteriaDiscountRuleByCafeteriaId(2);

    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('availableMealTypes');
    expect(result).toHaveProperty('cafeteriaId');
  });
});

describe('# getAllTransactionsOfUserToday', () => {
  it('should catch null id', async () => {
    const repo = getRepository();
    const result = await repo.getAllTransactionsOfUserToday(null);

    expect(result).toEqual([]);
  });

  it('should work', async () => {
    const repo = getRepository();
    const result = await repo.getAllTransactionsOfUserToday(null);

    result.forEach((transaction) => {
      expect(transaction).toHaveProperty('mealType');
      expect(transaction).toHaveProperty('userId');
      expect(transaction).toHaveProperty('cafeteriaId');
    });
  });
});

describe('# activateBarcode', () => {
  it('should catch null id', async () => {
    const repo = getRepository();
    const result = await repo.activateBarcode(null);

    expect(result).toBe(false);
  });

  it('should work', async () => {
    const repo = getRepository();

    const upsertMock = jest.fn();
    sequelize.model('user_discount_status').upsert = upsertMock;

    const result = await repo.activateBarcode(201701562);

    expect(result).toBe(true);
    expect(upsertMock).toBeCalledTimes(1);
  });
});

describe('# updateBarcodeTagTime', () => {
  it('should catch null id', async () => {
    const repo = getRepository();
    const result = await repo.updateBarcodeTagTime(null);

    expect(result).toBe(false);
  });

  it('should work', async () => {
    const repo = getRepository();

    const upsertMock = jest.fn();
    sequelize.model('user_discount_status').upsert = upsertMock;

    const result = await repo.updateBarcodeTagTime(201701562);

    expect(result).toBe(true);
    expect(upsertMock).toBeCalledTimes(1);
  });
});

describe('# writeDiscountTransaction', () => {
  it('should catch null transaction', async () => {
    const repo = getRepository();
    const result = await repo.writeDiscountTransaction(null);

    expect(result).toBe(false);
  });

  it('should work', async () => {
    const repo = getRepository();

    const createMock = jest.fn();
    sequelize.model('discount_transaction').create = createMock;

    const transaction = new DiscountTransaction({
      mealType: 2,
      userId: 201701562,
      cafeteriaId: 1,
    });
    const result = await repo.writeDiscountTransaction(transaction);

    expect(result).toBe(true);
    expect(createMock).toBeCalledTimes(1);
  });
});

describe('# removeDiscountTransaction', () => {
  it('should catch null transaction', async () => {
    const repo = getRepository();
    const result = await repo.removeDiscountTransaction(null);

    expect(result).toBe(false);
  });

  it('should work', async () => {
    const repo = getRepository();

    const destroyMock = jest.fn();
    sequelize.model('discount_transaction').destroy = destroyMock;

    const transaction = new DiscountTransaction({
      mealType: 2,
      userId: 201701562,
      cafeteriaId: 1,
    });
    const result = await repo.removeDiscountTransaction(transaction);

    expect(result).toBe(true);
    expect(destroyMock).toBeCalledTimes(1);
  });
});

const getRepository = function() {
  return new TransactionRepositoryImpl({
    db: sequelize,
  });
};
