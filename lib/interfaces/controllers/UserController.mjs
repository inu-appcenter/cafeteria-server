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

import resolve from '../../common/di/resolve';

import Login from '../../domain/usecases/Login';
import Logout from '../../domain/usecases/Logout';
import GetUser from '../../domain/usecases/GetUser';
import UserSerializer from '../serializers/UserSerializer';

import LoginResults from '../../domain/constants/LoginResults';
import LogoutResults from '../../domain/constants/LogoutResults';
import logger from '../../common/utils/logger';
import config from '../../../config';

import Boom from '@hapi/boom';

export default {

  async login(request, h) {
    return new LoginHandler(request, h).handle();
  },

  async logout(request, h) {
    return new LogoutHandler(request, h).handle();
  },

};

class LoginHandler {
  constructor(request, h) {
    this._request = request;
    this._h = h;
  }

  async handle() {
    const {result, jwt} = await this._tryLogin();

    if (result === LoginResults.SUCCESS) {
      return this._onLoginSuccess(this._request.payload.id, jwt);
    } else {
      return this._onLoginFailure(result);
    }
  }

  _tryLogin() {
    return resolve(Login).run({
      token: this._request.payload.token,
      id: this._request.payload.id,
      password: this._request.payload.password,
    });
  }

  async _onLoginSuccess(id, jwt) {
    logger.verbose(`${id} login succeeded`);

    const user = await resolve(GetUser).run({id: id});
    const serializedUser = resolve(UserSerializer).serialize(user);

    return this._successfulResponse(serializedUser, jwt);
  }

  _successfulResponse(body, jwt) {
    return this._h
      .state('token', jwt, config.auth.cookie_options) // cookie
      .header('Authorization', jwt) // header
      .response(body);
  }

  _onLoginFailure(result) {
    logger.warn(`Failed attempt to login. Full request: ${this._request}`);

    switch (result) {
      case LoginResults.WRONG_ID:
        return Boom.unauthorized('Invalid user id');

      case LoginResults.WRONG_PASSWORD:
        return Boom.unauthorized('Invalid password');

      case LoginResults.INVALID_TOKEN:
        return Boom.unauthorized('Invalid token');

      case LoginResults.NOT_SUPPORTED:
        return Boom.forbidden('Not supported');

      case LoginResults.FUCK:
        return Boom.unauthorized('Malformed!!');

      default:
        return Boom.badImplementation('What a terrible failure!');
    }
  }
}

class LogoutHandler {
  constructor(request, h) {
    this._request = request;
    this._h = h;
  }

  async handle() {
    if (!this._isAuthenticated()) {
      logger.warn('attempt to logout without authentication');
      return this._onNoAuth();
    }

    const {result} = await this._tryLogout();

    if (result === LogoutResults.SUCCESS) {
      return this._onLogoutSuccess(this._request.auth.credentials.id);
    } else {
      return this._onLogoutFail(result);
    }
  }

  _isAuthenticated() {
    return this._request.auth.isAuthenticated;
  }

  _onNoAuth() {
    return Boom.unauthorized('Missing authentication; Auth filtering before handler is disabled');
  }

  _tryLogout() {
    return resolve(Logout).run({
      id: this._request.auth.credentials.id,
    });
  }

  _onLogoutSuccess(id) {
    logger.verbose(`${id} logout succeeded`);

    return this._successfulResponse();
  }

  _successfulResponse() {
    return this._h
      .code(204)
      .state('token', 'expired', config.auth.cookie_options);
  }

  _onLogoutFail(result) {
    logger.warn(`Failed attempt to logout. Full request: ${this._request}`);

    switch (result) {
      case LogoutResults.USER_NOT_FOUND:
        return Boom.badImplementation('Cannot find user.');

      case LogoutResults.FUCK:
        return Boom.badImplementation('Something we never wanted happened :(');

      default:
        return Boom.badImplementation('What a terrible failure!');
    }
  }
}
