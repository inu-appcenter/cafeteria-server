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

/**
* Serializer
*/
const BaseSerializer = require('@domain/serializer/BaseSerializer');
const CafeteriaSerializer = require('@interfaces/serializers/CafeteriaSerializer');
const CornerSerializer = require('@interfaces/serializers/CornerSerializer');
const MenuSerializer = require('@interfaces/serializers/MenuSerializer');

/**
* Use Cases
*/
const GetCafeteria = require('@domain/usecases/GetCafeteria');
const GetCorners = require('@domain/usecases/GetCorners');
const GetMenus = require('@domain/usecases/GetMenus');
const ActivateBarcode = require('@domain/usecases/ActivateBarcode');
const GetDiscountValidity = require('@domain/usecases/ValidateDiscountTransaction');
const CommitDiscountTransaction = require('@domain/usecases/CommitDiscountTransaction');


/**
* Repository
*/
const CafeteriaRepository = require('@domain/repositories/CafeteriaRepository');
const CafeteriaRepositoryImpl = require('@interfaces/storage/CafeteriaRepositoryImpl');
const TransactionRepository = require('@domain/repositories/TransactionRepository');
const TransactionRepositoryImpl = require('@interfaces/storage/TransactionRepositoryImpl');
const UserRepository = require('@domain/repositories/UserRepository');
const UserRepositoryImpl = require('@interfaces/storage/UserRepositoryImpl');

/**
* Converter
*/
const MenuConverter = require('@domain/converters/MenuConverter');
const MenuConverterImpl = require('@interfaces/converters/MenuConverterImpl');
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


const instances = [];

function put(object) {
  instances.put(object);
}

function get(type) {
  const instancesOfType = instances.findAll((instance) => {
    return (instance.constructor) && (instance.constructor.name === type);
  });

  if (instancesOfType.length == 0) {
    throw new Error('No instances!');
  } else if (instancesOfType.length == 1) {
    return instancesOfType[0];
  } else {
    throw new Error('Duplicated instances!');
  }
}

// MenuConverter
put(
    new MenuConverter(
        new MenuConverterImpl(),
    ),
);

// Cafeteria repository
put(
    new CafeteriaRepository(
        new CafeteriaRepositoryImpl(
            get('MenuConverter'),
        ),
    ),
);

// Cafeteria serializer
put(
    new BaseSerializer(
        new CafeteriaSerializer(),
    ),
);

// Corner serializer
put(
    new BaseSerializer(
        new CornerSerializer(),
    ),
);

// Menu serializer
put(
    new BaseSerializer(
        new MenuSerializer(),
    ),
);


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
  resolve(typename) {
    return '';
  },
};
