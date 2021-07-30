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

import BadRequest from '../../../common/errors/http/BadRequest';

export const RequestIsMalformed = BadRequest.of(
  'request_malformed',
  '잘못된 형식의 요청입니다. 파라미터를 다시 확인하고 요청해주세요.'
);

export const DiscountNotAvailableNow = BadRequest.of(
  'not_available_now',
  '지금은 식당이 할인을 제공하는 시간대가 아닙니다. 다음에 다시 시도해 주세요.'
);

export const DiscountNotSupportedHere = BadRequest.of(
  'discount_not_supported',
  '이 식당은 할인을 제공하지 않습니다.'
);

export const UserNotIdentified = BadRequest.of(
  'user_not_identified',
  '사용자를 확인할 수 없습니다. 앱에 로그인되어있는지 확인해주세요.'
);

export const BarcodeNotActivated = BadRequest.of(
  'barcode_not_activated',
  '바코드가 활성화되어있지 않습니다. 앱이 켜져있는지 확인해주세요.'
);

export const DiscountAlreadyMadeHereToday = BadRequest.of(
  'discount_already_made_here_today',
  '오늘 이 식당에서 이미 할인을 제공받았습니다. 할인은 하루에 식당별로 한 번씩 제공받으실 수 있습니다.'
);

export const BarcodeUsedRecently = BadRequest.of(
  'barcode_used_recently',
  '바코드를 너무 빠르게 태그했습니다. 잠시 후에 다시 시도해 주세요.'
);

export const TokenIsNotValid = BadRequest.of(
  'invalid_token',
  '요청과 함께 전달된 토큰이 올바르지 않습니다.'
);
