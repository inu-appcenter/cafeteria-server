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
import LoginResults from '../../domain/entities/LoginResults';
import LogoutResults from '../../domain/entities/LogoutResults';
import logger from '../../common/utils/logger';

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
    this.request = request;
    this.payload = request.payload;
    this.h = h;

    this.response = null;
    this.user = null;
  }

  async handle() {
    const result = await this.tryLogin();

    if (result === LoginResults.SUCCESS) {
      logger.verbose(`${this.payload.id} login succeeded`);

      return this.onLoginSuccess();
    } else {
      logger.warn(`${this.payload.id} login failed: ${result}`);

      return this.onLoginFail(result);
    }
  }

  tryLogin() {
    return resolve(Login).run({
      token: this.payload.token,
      id: this.payload.id,
      password: this.payload.password,
    });
  }

  async onLoginSuccess() {
    this.user = await resolve(GetUser).run({id: this.payload.id});

    return this.responseWithJwt();
  }

  responseWithJwt() {
    this.setSuccessfulResponse();

    return this.response;
  }

  setSuccessfulResponse() {
    const jwt = this.createJwt();

    // Must be done before setting token.
    this.setResponseBody();

    this.setTokenInCookie(jwt);
    this.setTokenInHeader(jwt);
  }

  createJwt() {
    return JWT.sign(
      {id: this.user.id},
      config.auth.key,
      {algorithm: 'HS256'});
  }

  setResponseBody() {
    const serialized = resolve(UserSerializer).serialize(this.user);
    this.response = this.h.response(serialized);
  }

  setTokenInCookie(jwt) {
    this.response = this.response.state('token', jwt, config.auth.cookie_options);
  }

  setTokenInHeader(jwt) {
    this.response = this.response.header('Authorization', jwt);
  }

  onLoginFail(result) {
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
    this.request = request;
    this.h = h;
  }

  async handle() {
    if (!this.isAuthenticated) {
      return this.onNoAuth();
    }

    this.clearCookie();

    const result = await this.tryLogout();

    if (result === LogoutResults.SUCCESS) {
      logger.verbose(`${this.request.auth.credentials.id} login succeeded`);

      return this.onLogoutSuccess();
    } else {
      logger.warn(`${this.request.auth.credentials.id} login failed: ${result}`);

      return this.onLogoutFail(result);
    }
  }

  isAuthenticated() {
    return this.request.auth.isAuthenticated;
  }

  onNoAuth() {
    return Boom.unauthorized('Missing authentication; Auth filtering before handler is disabled');
  }

  tryLogout() {
    return resolve(Logout).run({
      id: this.request.auth.credentials.id,
    });
  }

  clearCookie() {
    // 'expired' means we are going to overwrite the 'token' field
    // with an invalid value.
    this.h.state('token', 'expired', config.auth.cookie_options);
  }

  onLogoutSuccess() {
    return this.h.response().code(204); /* send nothing */
  }

  onLogoutFail(result) {
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
