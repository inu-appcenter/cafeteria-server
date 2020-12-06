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
    const {result, jwt, rememberMeToken} = await this._tryLogin();

    if (result === LoginResults.SUCCESS) {
      return this._onLoginSuccess(this._request.payload.id, jwt, rememberMeToken);
    } else {
      return this._onLoginFailure(result);
    }
  }

  _tryLogin() {
    const userAgent = this._request.headers['user-agent'];
    logger.info(`User '${this._request.payload.id}'(${userAgent}) is trying to login`);

    return resolve(Login).run({
      id: this._request.payload.id,
      token: this._request.payload.token,
      password: this._request.payload.password,
    });
  }

  async _onLoginSuccess(id, jwt, rememberMeToken) {
    logger.verbose(`${id} login succeeded`);

    const user = await resolve(GetUser).run({id: id});
    user.token = rememberMeToken;
    // Important: rememberMeToken is not from the user DB. It should not be.
    // The user must have a plain remember-me token while the DB must retain a hashed one.

    const serializedUser = resolve(UserSerializer).serialize(user);

    return this._successfulResponse(serializedUser, jwt);
  }

  _successfulResponse(body, jwt) {
    return this._h.response(body)
      .header('Authorization', jwt) // header
      .state(config.auth.cookieKey, jwt, config.auth.cookieOptions); // cookie
  }

  _onLoginFailure(result) {
    logger.warn(`Failed attempt to login: ${result}`);

    switch (result) {
      case LoginResults.WRONG_AUTH:
        return Boom.unauthorized('Invalid user id or password');

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
    const {result} = await this._tryLogout();

    if (result === LogoutResults.SUCCESS) {
      return this._onLogoutSuccess(this._request.auth.credentials.id);
    } else {
      return this._onLogoutFail(result);
    }
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
    return this._h.response()
      .code(204)
      .state('token', 'expired', config.auth.cookieOptions);
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
