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

import config from './config';
import {logger, setupLogger} from '@inu-cafeteria/backend-core';
import startServer from './lib/infrastructure/webserver/server';
import {printInBox} from './lib/infrastructure/webserver/utils/printer';
import {startTypeORM} from '@inu-cafeteria/backend-core';

async function start() {
  console.log('로거를 설정합니다.');
  await setupLogger({
    consoleTransportOptions: {
      prefix: config.server.instanceName,
    },
    fileTransportOptions: {
      prefix: config.server.instanceName,
      logDirectory: config.server.logging.directory,
    },
    cloudwatchTransportOptions: config.isProduction
      ? {
          prefix: config.server.instanceName,
          region: config.external.aws.region,
          accessKeyId: config.external.aws.accessKeyId,
          secretAccessKey: config.external.aws.secretAccessKey,
          logGroupName: config.external.aws.cloudwatch.logGroupName,
        }
      : undefined,
  });

  logger.info('TypeORM과 데이터베이스 연결을 시작합니다.');
  await startTypeORM();

  logger.info('서버를 시작합니다.');
  await startServer();
}

start()
  .then(() => printInBox('SERVER STARTED', `Listening on ${config.server.port}`, '#'))
  .catch((e) => {
    console.error(e);
    console.log('서버 시작에 실패했습니다!');
  });
