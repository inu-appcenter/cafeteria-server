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

import UseCase from './UseCase';
import LoginResults from '../entities/LoginResults';

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

class Login extends UseCase {
  constructor({userRepository, barcodeTransformer}) {
    super();
    this.userRepository = userRepository;
    this.barcodeTransformer = barcodeTransformer;
  }

  async onExecute({id, token, password}) {
    let result;

    if (token) {
      result = await this.userRepository.tryLoginWithIdAndToken(id, token);
    } else if (id && password) {
      result = await this.userRepository.tryLoginWithIdAndPassword(id, password);
    } else {
      return null;
    }

    if (result === LoginResults.SUCCESS) {
      // Create a new barcode
      const newBarcode = this.barcodeTransformer.generateBarcodeWithId(id);

      // Set the barcode to the user.
      await this.userRepository.setBarcode(id, newBarcode);
    }

    return result;
  }
}

export default Login;
