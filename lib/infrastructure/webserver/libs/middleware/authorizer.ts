/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2021 INU Global App Center <potados99@gmail.com>
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

import {RequestHandler} from 'express';
import {decodeJwt} from '../../../../common/utils/token';
import config from '../../../../../config';
import {InvalidJwt, NotLoggedIn} from '../../../../application/user/common/Errors';

export type AuthorizerConfig = {
  exclude?: string[];
};

export function authorizer({exclude}: AuthorizerConfig): RequestHandler {
  return (req, res, next) => {
    if (exclude?.includes(req.path)) {
      return next();
    }

    const tokenFromCookie = req.cookies[config.auth.cookieName];
    if (tokenFromCookie == null) {
      return next(NotLoggedIn());
    }

    try {
      decodeJwt(tokenFromCookie);

      return next();
    } catch (e) {
      return next(InvalidJwt());
    }
  };
}
