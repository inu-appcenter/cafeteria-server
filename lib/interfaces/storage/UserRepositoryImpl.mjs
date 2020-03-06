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

'use strict';

import UserRepository from 'domain/repositories/UserRepository';
import User from 'domain/entities/User';

import LoginResults from '../../domain/entities/LoginResults';
import LogoutResults from '../../domain/entities/LogoutResults';

import sequelize from '../../infrastructure/database/sequelize';
import fetch from '../../common/utils/fetch';

import config from '../../../config/config';
import encrypt from '../../common/utils/encrypt';

import randToken from 'rand-token';
import bcrypt from 'bcrypt';

/**
 * Implementation of UserRepository.
 */
class UserRepositoryImpl extends UserRepository {
  constructor() {
    super();

    this.db = sequelize;

    this.userModel = this.db.model('user');
  }


  /**
   * Try login with login token.
   *
   * @param {number} id the id of the user
   * @param {string} token the login token. It will be refreshed once the function is executed.
   * @return {Promise<number>} one of LoginResults.
   * @see LoginResults
   */
  async tryLoginWithIdAndToken(id, token) {
    // Refresh token whatever the result is.
    // The token is for single-use.
    this._changeToken(id);

    const seqUser = await this.userModel.findByPk(id);

    // User must be specified.
    if (!seqUser) {
      return LoginResults.USER_NOT_FOUND;
    }

    // The token must be valid.
    const isValidToken = await bcrypt.compare(token/* the token incoming */, seqUser.token/* the one in the DB */);
    if (!isValidToken) {
      return LoginResults.INVALID_TOKEN;
    }

    // The only successful case.
    await this.userModel.upsert(
        {
          id: seqUser.id,
          last_login: sequelize.fn('NOW'),
        },
    );

    return LoginResults.SUCCESS;
  }

  /**
   * Try login with id and password.
   * This action always updates token.
   * If failed login, the existing token will be lost and every remember-me will be logged out.
   *
   * @param {number} id the id--called hak-bun--of the user.
   * @param {string} password the password of the user.
   * @return {Promise<number>} one of LoginResults.
   * @see LoginResults
   */
  async tryLoginWithIdAndPassword(id, password) {
    // Refresh token whatever the result is.
    // The token is for single-use.
    this._changeToken(id);

    // We do not handle login.
    // We just handle the login 'state'. (maybe by session or jwt or etc...)
    // Before sending the user credentials to the login server,
    // we encrypt the user's password with aes-256-cbc.
    const pwEncrypted = encrypt(password, config.login.key);
    const loginResponse = await fetch.post(
        config.login.url,
        {
          sno: id,
          pw: pwEncrypted,
        },
    );

    // Sadly the statements below cannot be done by switch-case.
    if (loginResponse === config.login.success) {
      await this.userModel.upsert(
          {
            id: id,
            last_login: sequelize.fn('NOW'),
          },
      );

      return LoginResults.SUCCESS;
    } else if (loginResponse === config.login.fail) {
      // current identification but service not available.
      return LoginResults.NOT_SUPPORTED;
    } else {
      // wrong id/password pair
      return LoginResults.WRONG_AUTH;
    }
  }

  /**
   * Try to logout a user with given id.
   *
   * @param {number} id an id of the user.
   * @return {Promise<number>} one of LogoutResults.
   * @see LogoutResults
   */
  async tryLogout(id) {
    const seqUser = await this.userModel.findByPk(id);

    if (!seqUser) {
      return LogoutResults.NO_USER;
    }

    await this.userModel.upsert({id: id, last_logout: sequelize.fn('NOW')});

    return LogoutResults.SUCCESS;
  }

  /**
   * Change a token of a user.
   * A token in the DB MUST BE HASHED.
   *
   * @param {number} userId
   * @return {Promise<void>}
   * @private
   */
  async _changeToken(userId) {
    const newToken = await this._createUniqueToken();
    const hashedNewToken = await bcrypt.hash(newToken, config.hash.saltRounds);

    await this.userModel.upsert(
        {
          id: userId,
          token: hashedNewToken,
        },
    );
  }

  /**
   * Create a token that never duplicated.
   *
   * @return {Promise<string>} a non-duplicated new token
   * @private
   */
  async _createUniqueToken() {
    let seqUserWithToken;
    let token;

    do {
      token = randToken.generate(20);
      seqUserWithToken = await this.userModel.findAll({where: {token}});
    } while (seqUserWithToken.length > 0);

    return token;
  }

  /**
   * Assign a barcode to a user.
   *
   * @param {number} id an id of the user who will have to barcode changed.
   * @param {number} barcode a new barcode number.
   * @return {Promise<boolean>} false if failed.
   */
  async setBarcode(id, barcode) {
    const seqUserWithId = await this.userModel.findByPk(id);

    if (!seqUserWithId) {
      return false;
    } else {
      await this.userModel.upsert({id: id, barcode: barcode});
      return true;
    }
  }

  /**
   * Get a user with its id.
   * @param {number} id the id.
   * @return {Promise<User|null>} null if failed.
   */
  async getUserById(id) {
    const seqUser = await this.userModel.findByPk(id);

    if (!seqUser) {
      return null;
    }

    return new User({
      id: seqUser.id,
      token: seqUser.token,
      barcode: seqUser.barcode,
    });
  }
}

export default UserRepositoryImpl;
