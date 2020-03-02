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

const GetUser = require('@domain/usecases/GetUser');

/**
 * Perform a login.
 *
 * This usecase is responsible for:
 * 1. Creating or updating a user with token and barcode
 * 2. Setting an auth sesstion.
 *
 * This usecase will return a login result as a number,
 * which is declared in UserRepository.
 */
module.exports = async (
  {token, id, password},
  {userRepository, barcodeTransformer},
) => {
  let result;

  // This action creates a user.
  if (token) {
    result = await userRepository.tryLoginWithToken(token);
  } else if (id && password) {
    result = await userRepository.tryLoginWithIdAndPassword(id, password);
  } else {
    return null;
  }

  if (result === UserRepository.LOGIN_OK) {
    // Getting the user is separated with creating or updating the user.
    // This action is only executed when the repository returned a LOGIN_OK,
    // which means the login is succeded and the user row is safely saved in DB.
    // The await keyword and this single thread model will ensure that
    // the DB transaction is finished here, so we can read the user from the DB.
    const user = await GetUser({token, id}, {userRepository});

    // Create a new barcode
    const newBarcode = barcodeTransformer.generateBarcodeWithId(user.id);

    // Set the barcode to the user.
    await userRepository.setBarcode(user.id, newBarcode);
  }

  return result;
};
