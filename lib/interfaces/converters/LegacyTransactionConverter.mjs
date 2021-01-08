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

import BaseConverter from './BaseConverter';
import DiscountTransaction from '../../domain/entities/DiscountTransaction';
import timeUtil from '../../common/utils/timeUtil';
import logger from '../../common/utils/logger';
import cafeCodeToCafeteriaId from '../legacy/isBarcode/cafeCode.mjs';
import MealType from '../../domain/constants/MealType.js';

/**
 * Convert legacy payment queries(barcode, code, menu, payment) to
 * domain DiscountTransaction object.
 */
class LegacyTransactionConverter extends BaseConverter {
  constructor({barcodeTransformer, transactionRepository}) {
    super();
    this.barcodeTransformer = barcodeTransformer;
    this.transactionRepository = transactionRepository;
  }

  async onConvert({barcode, code/* 'cafeteriaCode' */}) {
    if (!barcode || !code) {
      return null;
    }

    /**
     * Important: MealType is determined here, based on the request time and each Cafeteria validation params.
     *
     * For example, let's say 18:00 is in the middle of cafeteria1's dinner time.
     * If someone sent a discount request at 18:00 to the cafeteria1, it would be accepted
     * if the cafeteria allows discount a dinner.
     *
     * Other case, if another one made a request at 23:00, which is far after a dinner time,
     * the request's mealType would be set to 0, because any timeRanges of cafeteria1
     * includes 23:00.
     *
     * This is trustable because this mealType classification happens ON THIS SERVER.
     * BUT beware this is not 100% reliable because in any time the classification could be in hand of the client.
     * Therefore, time check should be performed again in a validator.
     */
    const cafeteriaId = this._getCafeteriaId(code);
    const mealType = await this._getMealType(cafeteriaId);
    const userId = this._getUserId(barcode);

    logger.info(`incoming old transaction request {barcode: ${barcode}, code: ${code}} at request time ${new Date()} now converted to a DiscountTransaction{mealType: ${mealType}, userId: ${userId}, cafeteriaId: ${cafeteriaId}}`);

    return new DiscountTransaction({mealType, userId, cafeteriaId});
  }

  _getCafeteriaId(code) {
    return cafeCodeToCafeteriaId(code);
  }

  async _getMealType(cafeteriaId) {
    const timeRanges = await this._getTimeRangesOfCafeteria(cafeteriaId);
    if (!timeRanges) {
      logger.warn(`Cannot get mealType: No timeRanges for cafeteria '${cafeteriaId}'!`);
      return 0;
    }

    if (timeUtil.isTimeInRange(timeRanges.breakfast)) {
      return MealType.BREAKFAST;
    } else if (timeUtil.isTimeInRange(timeRanges.lunch)) {
      return MealType.LUNCH;
    } else if (timeUtil.isTimeInRange(timeRanges.dinner)) {
      return MealType.DINNER;
    } else {
      return 0;
    }
  }

  async _getTimeRangesOfCafeteria(cafeteriaId) {
    if (!cafeteriaId) {
      return null;
    }

    const validationParam = await this.transactionRepository.getCafeteriaValidationParamsByCafeteriaId(cafeteriaId);
    if (!validationParam) {
      return null;
    }

    return validationParam.timeRanges;
  }

  _getUserId(barcode) {
    const userId = this.barcodeTransformer.extractIdFromBarcode(barcode);

    if (!userId) {
      logger.warn(`No user id found in barcode '${barcode}'!`);
    }

    return userId;
  }
}

export default LegacyTransactionConverter;
