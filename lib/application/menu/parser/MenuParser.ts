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

import Entitizer from './stage3/Entitizer';
import MenuTokenizer from './stage2/MenuTokenizer';
import RawMenuTextRetriever from './stage1/RawMenuTextRetriever';
import {Cafeteria, Corner, Menu} from '@inu-cafeteria/backend-core';

export type MenuParserParams = {
  rawHtml: string;
  cafeteriaWithCorners: Cafeteria[];
};

/**
 * 메뉴 파싱 얘한테 그냥 맡겨버려요!
 * 카페테리아와 함께 식단페이지 HTML을 넘겨주면 알아서 만들어 옵니다.
 */
export default class MenuParser {
  constructor(private readonly params: MenuParserParams) {}

  private rawMenuTextRetriever = new RawMenuTextRetriever(this.params.rawHtml); // stage 1
  private menuTokenizer = new MenuTokenizer(); // stage 2
  private entitizer = new Entitizer(); // stage 3

  async parse(): Promise<Menu[]> {
    const menus: Menu[] = [];

    for (const cafeteria of this.params.cafeteriaWithCorners) {
      for (const corner of cafeteria.corners) {
        const parsed = await this.parsePerCafeteriaAndCorner(cafeteria, corner);

        menus.push(...parsed);
      }
    }

    return menus;
  }

  private async parsePerCafeteriaAndCorner(cafeteria: Cafeteria, corner: Corner): Promise<Menu[]> {
    const rawMenuTexts = this.rawMenuTextRetriever.retrieve(cafeteria.name, corner.name);

    const processed = rawMenuTexts.map((t) => this.menuTokenizer.tokenize(t));

    return this.entitizer.toEntity(processed, corner.id);
  }
}
