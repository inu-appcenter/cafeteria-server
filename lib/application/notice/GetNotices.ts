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

export type GetNoticesParams = {
  id?: number;
  os?: string;
  version?: string;
};

class GetNotices extends UseCase<GetNoticesParams, Notice | Notice[] | undefined> {
  async onExecute({id, os, version}: GetNoticesParams): Promise<Notice | Notice[] | undefined> {
    if (id) {
      return await Notice.findOneOrFail(id);
    } else {
      const all = await Notice.find();
      const filter = new NoticeFilter({os, version});

      return all.filter((n) => filter.filter(n));
    }
  }
}

export default new GetNotices();
