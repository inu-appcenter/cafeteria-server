/**
 * This file is part of INU Cafeteria.
 *
 * Copyright 2021 INU Global App Center <potados99@gmail.com>
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

import config from '../../../config';
import express from 'express';
import recorder from '@inu-cafeteria/backend-core/dist/src/core/server/middleware/recorder';
import cookieParser from 'cookie-parser';
import {
  authorizer,
  errorHandler,
  registerRoutes,
  userIdGetterAssigner,
} from '@inu-cafeteria/backend-core';

/**
 * 인증을 건너뛰는 endpoint 목록입니다.
 */
const allowList = [
  '/',

  '/student/login',
  '/guest/challenge',
  '/guest/login',

  '/cafeteria/**',
  '/corners/**',
  '/menus/**',
  '/notices/**',

  '/kiosk/discount/**',

  '/internal/**',

  '/isBarcode',
  '/paymentSend',
];

const myAuthorizer = authorizer({
  jwtKey: config.server.jwt.key,
  jwtFieldName: config.server.jwt.cookieName,
  allowList,
});

const myUserIdGetterAssigner = userIdGetterAssigner({
  jwtFieldName: config.server.jwt.cookieName,
});

export default async function startServer() {
  const app = express();

  app.use(cookieParser());
  app.use(myAuthorizer);
  app.use(myUserIdGetterAssigner);

  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  app.use(recorder());

  await registerRoutes(app, __dirname + '/routes');

  app.use(errorHandler());

  app.listen(config.server.port);
}
