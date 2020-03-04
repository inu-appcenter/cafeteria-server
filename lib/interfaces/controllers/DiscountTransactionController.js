/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020 INU Appcenter <potados99@gmail.com>
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

'use strict';

import Injector from '#common/di/Injector';

import ValidateDiscountTransaction from '#domain/usecases/ValidateDiscountTransaction';
import LegacyTransactionConverter from '#interfaces/converters/LegacyTransactionConverter';
import CommitDiscountTransaction from '@domain/usecases/CommitDiscountTransaction';
import ActivateBarcode from '@domain/usecases/ActivateBarcode';

import DiscountValidationResults from '@domain/entities/DiscountValidationResults';
import DiscountCommitResults from '@domain/entities/DiscountCommitResults';

import Boom from '@hapi/boom';

const validateDiscountTransaction = Injector.resolve(ValidateDiscountTransaction);
const legacyTransactionConverter = Injector.resolve(LegacyTransactionConverter);
const commitDiscountTransaction = Injector.resolve(CommitDiscountTransaction);
const activateBarcode = Injector.resolve(ActivateBarcode);

export default {

  async activateBarcode(request, h) {
    const {id} = request.auth.credentials;

    const result = await activateBarcode.run({userId: id});

    if (result) {
      return h.response().code(204); /* send nothing */
    } else {
      return Boom.badImplementation('Cannot activate barcode');
    }
  },

  async checkDiscountAvailability(request, h) {
    const {barcode, code, menu} = request.query;

    const transaction = legacyTransactionConverter.convert({barcode, code/* effectively a cafeCode */});
    const token = menu; /* token does NOT belong to a transaction. */

    const result = await validateDiscountTransaction.run({transaction, token});

    switch (result) {
      case DiscountValidationResults.USUAL_SUCCESS:
        return h.response({message: 'SUCCESS', activated: 1}).code(200);

      case DiscountValidationResults.USUAL_FAIL:
        return h.response({message: 'SUCCESS', activated: 0}).code(200);

      case DiscountValidationResults.UNUSUAL_NO_BARCODE:
        return h.response({message: 'BARCODE_ERROR'}).code(400);

      case DiscountValidationResults.UNUSUAL_WRONG_PARAM:
        return h.response({message: 'Parameter_Error'}).code(400);

      default:
        return Boom.badImplementation('WHAT??');
    }
  },

  async commitDiscountTransaction(request, h) {
    const {barcode, code, menu, payment} = request.query;

    const transaction = legacyTransactionConverter.convert({barcode, code, menu});
    const confirm = payment === 'Y';

    const result = await commitDiscountTransaction.run({transaction, confirm});

    switch (result) {
      case DiscountCommitResults.SUCCESS:
        return h.response({message: 'SUCCESS'}).code(200);

      case DiscountCommitResults.ALREADY_DISCOUNTED:
        return h.response({message: 'Already_Discounted'}).code(200);

      case DiscountCommitResults.FAIL: /* don't know why but failed. */
        return h.response({message: 'ERROR'}).code(200);

      default:
        return Boom.badImplementation('WHAT??');
    }
  },

};
