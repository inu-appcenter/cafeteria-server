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

export default {

  async login(request, h) {
    const {token, id, password} = request.payload;

    const login = resolve(Login);

    const result = await login.run({token, id, password});

    if (result === LoginResults.SUCCESS) {
      // The only success case.

      const user = await resolve(GetUser).run({id});

      // Set auth here!
      // We will pass the token by both cookie and authorization header.
      // Cookie will persist on web browser, while the authorization header won't.
      //
      // For client, when sending a request that requires an authentication,
      // on the cookie method the name of the cookie does not matter.
      // On the other hand, if a client wants to send the token on the authorization
      // header, the name must match 'authorization' (case insensitive).
      const token = JWT.sign({id: user.id}, config.auth.key, {algorithm: 'HS256'}); /* create a token */

      // Set as cookie.
      // This method seems to be useful when implementing a web app.
      h.state('token', token, config.auth.cookie_options);

      // Reply with payload and auth header.
      return h.response(resolve(UserSerializer).serialize(user)).header('Authorization', token);
    } else {
      switch (result) {
        case LoginResults.WRONG_AUTH:
          return Boom.unauthorized('Invalid password');
        case LoginResults.INVALID_TOKEN:
          return Boom.unauthorized('Invalid token');
        case LoginResults.NOT_SUPPORTED:
          return Boom.forbidden('Not supported');
        default:
          return Boom.badImplementation();
      }
    }
  },

  async logout(request, h) {
    if (!request.auth.isAuthenticated) {
      // Only users with authentication can perform logout.
      return Boom.unauthorized('Missing authentication; Auth filtering before handler is disabled');
    }

    // Grep id before breaking the session.
    const {id} = request.auth.credentials;

    // Clear cookie that has the token.
    // Beware that this does not invalidate a token.
    // It just asks client to forget the token.
    h.state('token', 'expired', config.auth.cookie_options);

    const result = await resolve(Logout).run({id});

    if (result === LogoutResults.SUCCESS) {
      return h.response().code(204); /* send nothing */
    } else {
      if (result === LogoutResults.NO_USER) {
        return Boom.badImplementation('Cannot find user.');
      } else {
        return Boom.badImplementation('What a terrible failure!');
      }
    }
  },

};
