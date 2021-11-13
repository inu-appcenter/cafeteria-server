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

import MenuTokenizer from './MenuTokenizer';

describe('새로 바뀐 메뉴 파싱', () => {
  const parse = (raw: string) => new MenuTokenizer().tokenize(raw);

  it('2021-10-18 학생식당 조식의 일부', async () => {
    const raw =
      '현미시리얼\n' +
      '셀프토스트\n' +
      '흰우유\n' +
      '딸기잼\n' +
      '샐러드\n' +
      '황도\n' +
      '\n' +
      '4,000원\n' +
      '665kcal\n' +
      '\n' +
      '*8:30~10:30';

    const result = parse(raw);

    console.log(result);
  });

  it('2021-11-15 학생식당 중식(일품)의 일부', async () => {
    const raw =
      '양파크리미돈까스\n' +
      '시찌미주먹밥\n' +
      '모닝빵*딸기잼\n' +
      '오이피클\n' +
      '우동국물\n' +
      '\n' +
      '4,000원670kcal\n' +
      '\n' +
      '*11:30~소진시';

    const result = parse(raw);

    console.log(result);
  });

  it('엑스트라에 별 여러개와 공백 여러개', async () => {
    const raw =
      '양파크리미돈까스\n' +
      '시찌미주먹밥\n' +
      '모닝빵*딸기잼\n' +
      '오이피클\n' +
      '우동국물\n' +
      '\n' +
      '4,000원670kcal\n' +
      '\n' +
      '****      11:30~소진시';

    const result = parse(raw);

    console.log(result);
  });
});
