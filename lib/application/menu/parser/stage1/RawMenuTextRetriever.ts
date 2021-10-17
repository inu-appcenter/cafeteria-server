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

import cheerio from 'cheerio';
import {logger} from '@inu-cafeteria/backend-core';
import {compareIgnoringWhiteSpaces} from '../../../../common/utils/string';

export default class RawMenuTextRetriever {
  constructor(private readonly rawHtml: string) {}

  retrieve(cafeteriaName: string, cornerName: string) {
    logger.verbose(
      `<메뉴 파싱 stage 1> ${cornerName}(${cornerName})의 메뉴 정보 스트링을 모두 가져옵니다.`
    );

    // 한 블록에 여러 개의 메뉴가 '===' 또는 '-------------'로 이어져 들어 있습니다.
    const rawCombined = this.grepTextBlock(cafeteriaName, cornerName);

    // 3개 이상의 '=' 또는 '-'를 기준으로 나눕니다.
    return rawCombined.split(/={3,}|-{3,}/);
  }

  private grepTextBlock(cafeteriaName: string, cornerName: string) {
    const $ = cheerio.load(this.rawHtml);

    // This filter is used to determine whether the <td>'s text roughly equals the cornerName.
    // The td is passed as a receiver, therefore we have to use 'function' for its own scope.
    const cornerNameFilter = function () {
      // @ts-ignore
      return compareIgnoringWhiteSpaces($(this).text(), cornerName);
    };

    const $cornerNameTd = $(`table > tbody:Contains("${cafeteriaName}") > tr > td`).filter(
      cornerNameFilter
    );

    const $cornerMenuTds = $cornerNameTd.closest('tr').next().children();

    // Corner name and the contents are coupled by index.
    // Example:
    // |------------------------------|
    // | A lunch | A dinner | B lunch |
    // |------------------------------|
    // |  Menu1  |  Menu2   |  Menu3  |
    // |------------------------------|
    // 'A lunch' and 'Menu1' has index 0.
    // 'A dinner' and 'Menu2' has index 1.
    // 'B lunch' and 'Menu3' has index 2.
    // Same column index, different row.
    //
    // Corner name cells can share a single menu cell.
    // Multiple indices of the name cells should point the shared menu cell.
    // Example:
    // |------------------------------|
    // | A lunch | A dinner | B lunch |
    // |------------------------------|
    // |         No menu today        |
    // |------------------------------|
    // 'A lunch' has index 0. It is associated with index 0 of the row below.
    // 'A dinner' has index 1. But it has to be paired with index 0 of the under row.
    // 'B lunch' has index 2. It also has to be paired with index 0 of that row.

    const cornerNameIndex = $cornerNameTd.index();
    const cornerMenuLength = $cornerMenuTds.length;

    const $cornerMenuTd = $cornerMenuTds.eq(Math.min(cornerNameIndex, cornerMenuLength - 1));

    return $cornerMenuTd.text();
  }
}
