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

import expose from './expose';

export default {
  name: 'public',
  version: '1.0.0',
  register: async (server) => {
    server.route([
      {
        method: 'GET',
        path: '/{param*}',
        handler: {
          directory: {
            path: expose.__dirname + '/../../../../public', /* public dir should be outside of lib. */
            redirectToSlash: false,
            index: false,
          },
        },
        options: {
          description: '공용 호스트 파일',
          notes: ['public 디렉토리에 접근합니다.'],
          tags: ['api', 'public'],
        },
      },
    ]);
  },
};
