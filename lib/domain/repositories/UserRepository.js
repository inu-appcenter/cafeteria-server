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

class UserRepository {
  static LOGIN_OK = 0;
  static LOGIN_WRONG_ID_PW = 1;
  static LOGIN_INVALID_TOKEN = 2;
  static LOGIN_NOT_SUPPORTED = 3;

  static LOGOUT_OK = 4;
  static LOGOUT_NO_USER = 5;
  static LOGOUT_NO_AUTH = 6;

  tryLoginWithToken(token) {
    throw new Error('Not implemented!');
  }

  tryLoginWithIdAndPassword(id, password) {
    throw new Error('Not implemented!');
  }

  tryLogout(id) {
    throw new Error('Not implemented!');
  }

  setBarcode(id, barcode) {
    throw new Error('Not implemented!');
  }

  getUserById(id) {
    throw new Error('Not implemented!');
  }

  getUserByToken(token) {
    throw new Error('Not implemented!');
  }
}

export default UserRepository;
