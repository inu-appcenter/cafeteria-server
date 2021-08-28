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

import UseCase from '../../common/base/UseCase';
import {Notice} from '@inu-cafeteria/backend-core';
import NoticeFilter from './NoticeFilter';

export type GetLatestNoticesParams = {
  os?: string;
  version?: string;
};

class GetLatestNotices extends UseCase<GetLatestNoticesParams, Notice | undefined> {
  async onExecute({os, version}: GetLatestNoticesParams): Promise<Notice | undefined> {
    const all = await Notice.find();
    const filter = new NoticeFilter({os, version});

    const noticesForThisClient = all
      .filter((n) => filter.filter(n))
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    return noticesForThisClient.pop();
  }
}

export default new GetLatestNotices();
