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

import getCupidCookie from './script';

/**
 * 생협 홈페이지를 해외 ip로 접근하려면 cafe24 방화벽을 뚫어야 합니다.
 * 그걸 하려면 페이지에 삽입된 내용과 페이지에 심어진 스크립트를 참고하여 CUPID 쿠키(무슨뜻인지모름)를 구해와야 합니다.
 *
 * 페이지 스크립트는 ./embedded 디렉토리에 들어 있습니다.
 * 이 파일은 호출을 편하게 해주는 wrapper입니다.
 *
 * @param pageContent 페이지 html.
 */
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
