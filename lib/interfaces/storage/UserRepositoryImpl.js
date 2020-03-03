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

import UserRepository from 'domain/repositories/UserRepository';
import User from 'domain/entities/User';

import sequelize from 'infrastructure/database/sequelize';
import fetch from 'infrastructure/network/fetch';

import config from 'config/config';
import encrypt from 'common/encrypt';

import {generate} from 'rand-token';

class UserRepositoryImpl extends UserRepository{
  constructor() {
    super();

    this.db = sequelize;

    this.userModel = this.db.model('user');
  }

  async tryLoginWithToken(token) {
    const seqUserWithGivenToken = await this.userModel.findOne(
        {
          where: {token: token},
        },
    );

    if (seqUserWithGivenToken) {
      // update last login timestamp.
      await this.userModel.upsert(
          {
            id: seqUserWithGivenToken.id,
            last_login: sequelize.fn('NOW'),
          },
      );
      return UserRepository.LOGIN_OK;
    } else {
      return UserRepository.LOGIN_INVALID_TOKEN;
    }
  }

  async tryLoginWithIdAndPassword(id, password) {
    const pwEncrypted = encrypt(password, config.login.key);
    const loginResponse = await fetch.post(
        config.login.url,
        {
          sno: id,
          pw: pwEncrypted,
        },
    );

    if (loginResponse === config.login.success) {
      // the only success case.
      // now we create new token.
      const newToken = await this._createUniqueToken();

      // insert or update user.
      await this.userModel.upsert({id: id, token: newToken});

      // update last login of the user.
      await this.userModel.upsert({id: id, last_login: sequelize.fn('NOW')});

      return UserRepository.LOGIN_OK;
    } else if (loginResponse === config.login.fail) {
      // current identification but service not available.
      return UserRepository.LOGIN_NOT_SUPPORTED;
    } else {
      // wrong id/password pair
      return UserRepository.LOGIN_WRONG_ID_PW;
    }
  }

  async tryLogout(id) {
    const seqUserWithId = await this.userModel.findByPk(id);

    if (!seqUserWithId) {
      return UserRepository.LOGOUT_NO_USER;
    }

    await this.userModel.upsert({id: id, last_logout: sequelize.fn('NOW')});

    return UserRepository.LOGOUT_OK;
  }

  async _createUniqueToken() {
    let seqUserWithToken;
    let token;

    do {
      token = generate(20);
      seqUserWithToken = await this.userModel.findAll({where: {token}});
    } while (seqUserWithToken.length > 0);

    return token;
  }

  async setBarcode(id, barcode) {
    const seqUserWithId = await this.userModel.findByPk(id);

    if (!seqUserWithId) {
      return false;
    } else {
      await this.userModel.upsert({id: id, barcode: barcode});
      return true;
    }
  }

  async getUserById(id) {
    const seqUserWithId = await this.userModel.findByPk(id);

    if (!seqUserWithId) {
      return null;
    }

    return new User({
      id: seqUserWithId.id,
      token: seqUserWithId.token,
      barcode: seqUserWithId.barcode,
      lastBarcodeActivation: seqUserWithId.last_barcode_activation,
      lastBarcodeTag: seqUserWithId.last_barcode_tag,
    });
  }

  async getUserByToken(token) {
    const seqUserWithGivenToken = await this.userModel.findOne(
        {
          where: {token: token},
        },
    );

    if (!seqUserWithGivenToken) {
      return null;
    }

    return new User({
      id: seqUserWithGivenToken.id,
      token: seqUserWithGivenToken.token,
      barcode: seqUserWithGivenToken.barcode,
      lastBarcodeActivation: seqUserWithGivenToken.last_barcode_activation,
      lastBarcodeTag: seqUserWithGivenToken.last_barcode_tag,
    });
  }
}

export default UserRepositoryImpl;
