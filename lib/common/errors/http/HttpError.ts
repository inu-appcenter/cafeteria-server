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

export default class HttpError extends Error {
  statusCode: number;
  error: string; // 에러 식별자. 서비스 내부에서만 쓰이는 디테일을 표현. 예를 들어 invalid_remember_me_token 이라든가...
  message: string; // 에러에 대한 해설.

  constructor(statusCode: number, error: string, message: string) {
    super();

    this.statusCode = statusCode;
    this.error = error;
    this.message = message;
  }

  static with(statusCode: number): ErrorConstructorGenerator {
    return (error: string, message: string) => () => new HttpError(statusCode, error, message);
  }

  static of: ErrorConstructorGenerator;
}

export type ErrorConstructorGenerator = (error: string, message: string) => () => HttpError;
