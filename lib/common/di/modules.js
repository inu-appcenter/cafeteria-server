/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020 INU Appcenter <potados99gmail.com>
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

/**
 * Converter
 */
import MenuConverter from '@domain/converter/MenuConverter';

/**
 * Serializer
 */
import BaseSerializer from '@domain/serializer/BaseSerializer';

import CafeteriaSerializer from '@interfaces/serializers/CafeteriaSerializer';

import CornerSerializer from '@interfaces/serializers/CornerSerializer';

import MenuSerializer from '@interfaces/serializers/MenuSerializer';

/**
 * Use Cases
 */
import GetCafeteria from '@domain/usecases/GetCafeteria';

import GetCorners from '@domain/usecases/GetCorners';

import GetMenus from '@domain/usecases/GetMenus';

import ActivateBarcode from '@domain/usecases/ActivateBarcode';

import GetDiscountValidity from '@domain/usecases/ValidateDiscountTransaction';

import CommitDiscountTransaction from '@domain/usecases/CommitDiscountTransaction';

/**
 * Repository
 */
import CafeteriaRepository from '@domain/repositories/CafeteriaRepository';

import CafeteriaRepositoryImpl from '@interfaces/storage/CafeteriaRepositoryImpl';

import TransactionRepository from '@domain/repositories/TransactionRepository';

import TransactionRepositoryImpl from '@interfaces/storage/TransactionRepositoryImpl';

import UserRepository from '@domain/repositories/UserRepository';

import UserRepositoryImpl from '@interfaces/storage/UserRepositoryImpl';


import LegacyTransactionConverter from '@domain/converter/LegacyTransactionConverter';

import LegacyTransactionConverterImpl from '@interfaces/converter/LegacyTransactionConverterImpl';

/**
 * Transformers
 */
import BarcodeTransformer from '@domain/security/BarcodeTransformer';

import BarcodeTransformerImpl from '@interfaces/security/BarcodeTransformerImpl';

/**
 * Validators
 */
import DiscountTransactionValidator from '@domain/validators/DiscountTransactionValidator';

import DiscountTransactionValidatorImpl from '@interfaces/validators/DiscountTransactionValidatorImpl';
import UserValidatorImpl from '@interfaces/security/UserValidatorImpl';
import UserValidator from '@domain/security/UserValidator';




/**
 * Security
 */

// Barcode transformer
put(
  new BarcodeTransformerImpl(),
  BarcodeTransformer,
);


// Legacy transaction converter
put(
  new LegacyTransactionConverterImpl(

  ),
);


/**
 * Serializer
 */

// Cafeteria serializer
put(
  new CafeteriaSerializer(),
  CafeteriaSerializer,
);

// Corner serializer
put(new CornerSerializer(),
  CornerSerializer,
);

// Menu serializer
put(
  new MenuSerializer(),
  MenuSerializer,
);


// MenuConverter
put(
  new MenuConverter(),
  MenuConverter,
);

/**
 * Repository
 */

// Cafeteria repository
put(
  async (r) => new CafeteriaRepositoryImpl(await r(MenuConverter)),
  CafeteriaRepository,
);

// Transaction repository
put(
  new TransactionRepositoryImpl(),
  TransactionRepository,
);

// User repository
put(
  new UserRepositoryImpl(),
  UserRepository,
);




const transactionRepository = new TransactionRepository(
  new TransactionRepositoryImpl(),
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

// User validator
put(
  new UserValidatorImpl(
    get(UserRepository),
  ),
  UserValidator,
);


export default createFunctions;
