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

const Boom = require('@hapi/boom');

/**
 * Use cases
 */
const ActivateBarcode = require('@domain/usecases/ActivateBarcode');
const GetDiscountValidity = require('@domain/usecases/GetDiscountValidity');
const CommitDiscountTransaction = require('@domain/usecases/CommitDiscountTransaction');

/**
 * Repositories
 */
const TransactionRepository = require('@domain/repositories/TransactionRepository');
const TransactionRepositoryImpl = require('@interfaces/storage/TransactionRepositoryImpl');
const UserRepository = require('@domain/repositories/UserRepository');
const UserRepositoryImpl = require('@interfaces/storage/UserRepositoryImpl');

/**
 * Converters
 */
const LegacyTransactionConverter = require('@domain/converters/LegacyTransactionConverter');
const LegacyTransactionConverterImpl = require('@interfaces/converters/LegacyTransactionConverterImpl');

/**
 * Transformers
 */
const BarcodeTransformer = require('@domain/security/BarcodeTransformer');
const BarcodeTransformerImpl = require('@interfaces/security/BarcodeTransformerImpl');

/**
 * Validators
 */
const DiscountTransactionValidator = require('@domain/validators/DiscountTransactionValidator');
const DiscountTransactionValidatorImpl = require('@interfaces/validators/DiscountTransactionValidatorImpl');

/**
 * Instances
 */
const transactionRepository = new TransactionRepository(
    new TransactionRepositoryImpl(),
);

const userRepository = new UserRepository(
    new UserRepositoryImpl(),
);

const barcodeTransformer = new BarcodeTransformer(
    new BarcodeTransformerImpl(),
);
const transactionConverter = new LegacyTransactionConverter(
    new LegacyTransactionConverterImpl(barcodeTransformer),
);

const transactionValidator = new DiscountTransactionValidator(
    new DiscountTransactionValidatorImpl({
      transactionRepository,
      userRepository,
    }),
);

module.exports = {

  async activateBarcode(request, h) {
    if (!request.auth.isAuthenticated) {
      // Only users with authentification can perform logout.
      return Boom.unauthorized('Missing authentication; Auth filtering before handler is disabled');
    }

    const {id} = request.auth.credentials;

    const result = await ActivateBarcode(
        {userId: id},
        {transactionRepository},
    );

    if (result) {
      return h.response().code(204); /* send nothing */
    } else {
      return Boom.badImplementation('Cannot activate barcode');
    }
  },

  async checkDiscountAvailibility(request, h) {
    const {barcode, code, menu} = request.query;

    const transaction = transactionConverter.convert({barcode, code/* effectively a cafeCode */});
    const token = menu; /* token does NOT belong to a transaction. */

    const result = await GetDiscountValidity(
        {transaction, token},
        {validator: transactionValidator},
    );

    switch (result) {
      case GetDiscountValidity.returnCodes.USUAL_SUCCESS:
        return h.response({message: 'SUCCESS', activated: 1}).code(200);

      case GetDiscountValidity.returnCodes.USUAL_FAIL:
        return h.response({message: 'SUCCESS', activated: 0}).code(200);

      case GetDiscountValidity.returnCodes.UNUSUAL_NO_BARCODE:
        return h.response({message: 'BARCODE_ERROR'}).code(400);

      case GetDiscountValidity.returnCodes.UNUSUAL_WRONG_PARAM:
        return h.response({message: 'Parameter_Error'}).code(400);

      default:
        return Boom.badImplementation('WHAT??');
    }
  },

  async commitDiscountTransaction(request) {
    const {barcode, code, menu, payment} = request.query;

    const transaction = transactionConverter.convert({barcode, code, menu});
    const confirm = payment == 'Y';

    const result = await CommitDiscountTransaction(
        {transaction, confirm},
        {transactionRepository, validator: transactionValidator},
    );

    switch (result) {
      case CommitDiscountTransaction.returnCodes.SUCCESS:
        return h.response({message: 'SUCCESS'}).code(200);

      case CommitDiscountTransaction.returnCodes.ALREADY_DISCOUNTED:
        return h.response({message: 'Already_Discounted'}).code(200);

      case CommitDiscountTransaction.returnCodes.INTERNAL_ERROR:
        return h.response({message: 'ERROR'}).code(200);

      default:
        return Boom.badImplementation('WHAT??');
    }
  },

};
