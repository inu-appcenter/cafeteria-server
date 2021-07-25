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

import getCupidCookie from './embeded/script';

export function imitateCupidCookie(pageContent: string) {
  const result =
    /a=toNumbers\("(?<A>.+)"\),b=toNumbers\("(?<B>.+)"\),c=toNumbers\("(?<C>.+)"\)/.exec(
      pageContent
    );

  if (result?.groups == null) {
    throw new Error(
      '생협 웹사이트 Cupid Cookie를 가져오지 못했습니다. A, B, C를 확인할 수 없습니다.'
    );
  }

  const {A, B, C} = result.groups;

  return getCupidCookie(A, B, C);
}
