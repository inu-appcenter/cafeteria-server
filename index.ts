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

import logger from './lib/common/logging/logger';
import {startTypeORM} from '@inu-cafeteria/backend-core';
import startServer from './lib/infrastructure/webserver/server';

async function start() {
  logger.info('TypeORM 시작합니다.');
  await startTypeORM(true);

  logger.info('ㅎㅇㅎㅇ');
  await startServer();
}

start()
  .then((e) => console.log('서버 시작!'))
  .catch((e) => console.error(`서버 시작 실패: ${e}`));
