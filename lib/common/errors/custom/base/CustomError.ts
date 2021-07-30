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

/**
 * 응답 객체의 형태를 따로 지정하고 싶을 때에 사용합니다.
 */
export default class CustomError<ErrorResponseT extends Record<string, any>> extends Error {
  constructor(
    /**
     * 에러에 대응되는 HTTP 상태 코드
     */
    readonly statusCode: number,
    /**
     * 에러 응답 객체. 그대로 json 응답 나갈 것임.
     */
    readonly errorResponse: ErrorResponseT
  ) {
    super();
  }

  static of: CustomErrorConstructorGenerator<any>;

  static with<T>(statusCode: number): CustomErrorConstructorGenerator<T> {
    return (errorResponse) => () => new CustomError(statusCode, errorResponse);
  }

  get responseBody() {
    return this.errorResponse;
  }
}

export type CustomErrorConstructorGenerator<ErrorResponseT extends Record<string, any>> = (
  responseObject: ErrorResponseT
) => () => CustomError<ErrorResponseT>;
