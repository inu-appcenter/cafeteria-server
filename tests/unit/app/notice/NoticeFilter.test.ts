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

import {Notice} from '@inu-cafeteria/backend-core';
import NoticeFilter from '../../../../lib/application/notice/NoticeFilter';

describe('공지 필터하기', () => {
  it('os와 version이 둘 다 맞으면 true', async () => {
    const notice = new Notice();
    notice.targetOs = 'ios';
    notice.targetVersion = '1.1.2';

    const filter = new NoticeFilter({
      os: 'ios',
      version: '1.1.2',
    });

    expect(filter.filter(notice)).toBe(true);
  });

  it('os고 version이고 wildcard면 true', async () => {
    const notice = new Notice();
    notice.targetOs = '*';
    notice.targetVersion = '*';

    const filter = new NoticeFilter({
      os: 'ios',
      version: '1.1.2',
    });

    expect(filter.filter(notice)).toBe(true);
  });

  it('os가 맞고 version이 semver 매칭되면 true 1', async () => {
    const notice = new Notice();
    notice.targetOs = 'ios';
    notice.targetVersion = '1.1.4';

    const filter = new NoticeFilter({
      os: 'ios',
      version: '^1.1.0',
    });

    expect(filter.filter(notice)).toBe(true);
  });

  it('os가 맞고 version이 semver 매칭되면 true 2', async () => {
    const notice = new Notice();
    notice.targetOs = 'ios';
    notice.targetVersion = '1.1.4';

    const filter = new NoticeFilter({
      os: 'ios',
      version: '>= 1.0.0 <= 1.2.0',
    });

    expect(filter.filter(notice)).toBe(true);
  });

  it('version이 맞아도 os가 다르면 false', async () => {
    const notice = new Notice();
    notice.targetOs = 'ios';
    notice.targetVersion = '1.1.2';

    const filter = new NoticeFilter({
      os: 'android',
      version: '1.1.2',
    });

    expect(filter.filter(notice)).toBe(false);
  });

  it('os가 맞아도 version이 다르면 false', async () => {
    const notice = new Notice();
    notice.targetOs = 'ios';
    notice.targetVersion = '1.1.2';

    const filter = new NoticeFilter({
      os: 'ios',
      version: '1.1.4',
    });

    expect(filter.filter(notice)).toBe(false);
  });
});
