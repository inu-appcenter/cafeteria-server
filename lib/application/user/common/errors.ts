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

import {
  BadRequest,
  Forbidden,
  InternalServerError,
  Unauthorized,
} from '@inu-cafeteria/backend-core';

export const UserNotExist = BadRequest.of('user_not_exist', '사용자가 존재하지 않습니다.');

export const InvalidRememberMeToken = Unauthorized.of(
  'invalid_remember_me_token',
  '유효하지 않은 자동로그인 토큰입니다.'
);

export const NotLoggedIn = Unauthorized.of('not_logged_in', '로그인해주세요!');

export const InvalidJwt = Unauthorized.of('invalid_jwt', '로그인해주세요!');

export const InvalidPhoneNumber = BadRequest.of(
  'invalid_phone_number',
  '잘못된 휴대전화번호 형식입니다!'
);

export const InvalidPasscode = BadRequest.of(
  'invalid_passcode',
  '인증번호가 만료되었거나 올바르지 않습니다 😯'
);

export const BadFormedCredentials = BadRequest.of(
  'bad_formed_credentials',
  '올바른 학번과 비밀번호를 입력해주세요 😉'
);

export const InvalidCredentials = Unauthorized.of(
  'invalid_credentials',
  '학번과 비밀번호를 확인해 주세요 😉'
);

export const ForUndergraduatesOnly = Forbidden.of(
  'for_undergraduates_only',
  '수료 또는 졸업하신 경우 서비스 이용이 어렵습니다 😢'
);

export const StudentLoginUnavailable = InternalServerError.of(
  'student_login_unavailable',
  '로그인 서버에 문제가 생겼습니다 🤯'
);
