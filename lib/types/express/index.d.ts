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

// https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript 참고

// noinspection ES6UnusedImports
import * as express from 'express-serve-static-core'; // 있어야 함.

declare module 'express-serve-static-core' {
  interface Request {
    /**
     * 요청에서 빼낸 사용자의 id를 가져옵니다.
     * 만약 없다면, 요구하는 그 순간에 예외를 던집니다.
     */
    get userId(): number;
  }
  interface Response {
    myField?: string;
  }
}
