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

import config from '../../../config';

import JWT from 'jsonwebtoken';
import Boom from '@hapi/boom';
import LoginResults from '../../domain/constants/LoginResults';
import LogoutResults from '../../domain/constants/LogoutResults';
import logger from '../../common/utils/logger';
import TokenManager from '../../domain/security/TokenManager';

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
    this._payload = request.payload;
    this._h = h;

    this._response = null;
    this._user = null;
  }

  async handle() {
    const result = await this._tryLogin();

    if (result === LoginResults.SUCCESS) {
      logger.verbose(`${this._payload.id} login succeeded`);

      return this._onLoginSuccess();
    } else {
      logger.warn(`${this._payload.id} login failed: ${result}`);

      return this._onLoginFail(result);
    }
  }

  _tryLogin() {
    return resolve(Login).run({
      token: this._payload.token,
      id: this._payload.id,
      password: this._payload.password,
    });
  }

  async _onLoginSuccess() {
    this._user = await resolve(GetUser).run({id: this._payload.id});

    return this._responseWithJwt();
  }

  _responseWithJwt() {
    this._setSuccessfulResponse();

    return this._response;
  }

  _setSuccessfulResponse() {
    this._setResponseBody();
    this._setTokenInCookieAndHeader();
  }

  _setResponseBody() {
    const serialized = resolve(UserSerializer).serialize(this._user);
    this._response = this._h.response(serialized);
  }

  _setTokenInCookieAndHeader() {
    const jwt = resolve(TokenManager).createJwt({id: this._user.id});

    this._response = this._response.state('token', jwt, config.auth.cookie_options); // cookie
    this._response = this._response.header('Authorization', jwt); // header
  }

  _onLoginFail(result) {
    switch (result) {
      case LoginResults.USER_NOT_FOUND:
        return Boom.unauthorized('Invalid user');

      case LoginResults.NOT_SUPPORTED:
        return Boom.forbidden('Not supported');

      case LoginResults.WRONG_AUTH:
        return Boom.unauthorized('Invalid password');

      case LoginResults.INVALID_TOKEN:
        return Boom.unauthorized('Invalid token');

      case LoginResults.FUCK:
        return Boom.unauthorized('Malformed auth info!');

      default:
        return Boom.badImplementation('What a terrible failure!');
    }
  }
}

class LogoutHandler {
  constructor(request, h) {
    this._auth = request.auth;
    this._h = h;
  }

  async handle() {
    if (!this._isAuthenticated()) {
      logger.warn('attempt to logout without authentication');
      return this._onNoAuth();
    }

    this._clearCookie();

    const result = await this._tryLogout();

    if (result === LogoutResults.SUCCESS) {
      logger.verbose(`${this._auth.credentials.id} logout succeeded`);

      return this._onLogoutSuccess();
    } else {
      logger.warn(`${this._auth.credentials.id} logout failed: ${result}`);

      return this._onLogoutFail(result);
    }
  }

  _isAuthenticated() {
    return this._auth.isAuthenticated;
  }

  _onNoAuth() {
    return Boom.unauthorized('Missing authentication; Auth filtering before handler is disabled');
  }

  _tryLogout() {
    return resolve(Logout).run({
      id: this._auth.credentials.id,
    });
  }

  _clearCookie() {
    // 'expired' means we are going to overwrite the 'token' field
    // with an invalid value, but not empty string.
    this._h.state('token', 'expired', config.auth.cookie_options);
  }

  _onLogoutSuccess() {
    return this._h.response().code(204); // send nothing
  }

  _onLogoutFail(result) {
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
