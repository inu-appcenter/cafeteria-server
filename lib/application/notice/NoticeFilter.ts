/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020 INU Global App Center <potados99@gmail.com>
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

import {Notice} from '@inu-cafeteria/backend-core';
import VersionEvaluator from './VersionEvaluator';

export type NoticeFilterParams = {
  os?: string;
  version?: string;
};

export default class NoticeFilter {
  constructor(private readonly params: NoticeFilterParams) {}

  /**
   * 저장된 공지의 OS와 version에 대해,
   * 각각 필드가 wildcard(*, 공백, null, undefined)가 아닌 이상
   * 요청과 함께 지정된 값과 매치가 이루어질 때에만 true를 반환합니다.
   *
   * OS는 정확한 스트링 매치가 이루어져야 true,
   * Version은 semver 구현체의 VersionEvaluator를 만족해야 true입니다.
   *
   * @param notice 필터 여부를 결정해야 하는 공지.
   */
  filter(notice: Notice): boolean {
    return this.filterOs(notice) && this.filterVersion(notice);
  }

  private filterOs(notice: Notice) {
    const {os} = this.params;

    const wildcardPassed = this.isWildcard(notice.targetOs);
    const exactMatches = notice.targetOs === os;

    return wildcardPassed || exactMatches;
  }

  private filterVersion(notice: Notice) {
    const {version} = this.params;

    const wildcardPassed = this.isWildcard(notice.targetVersion);
    const evaluationMatches = !!version && VersionEvaluator.evaluate(notice.targetVersion, version);

    return wildcardPassed || evaluationMatches;
  }

  private isWildcard(field: string) {
    const supportedWildcards = ['*', '', null, undefined];

    return supportedWildcards.includes(field);
  }
}
