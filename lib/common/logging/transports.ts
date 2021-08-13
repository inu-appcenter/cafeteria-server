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

import 'winston-daily-rotate-file';

import winston from 'winston';
import config from '../../../config';
import AWS from 'aws-sdk';
import WinstonCloudwatch from 'winston-cloudwatch';
import {getConsoleFormat, getFileFormat} from './formats';

export function getConsoleTransport() {
  return new winston.transports.Console({
    format: getConsoleFormat(),
  });
}

export function getFileTransport(prefix: string) {
  return new winston.transports.DailyRotateFile({
    format: getFileFormat(),
    filename: config.server.logging.filepath(prefix),
    datePattern: 'YYYY-MM-DD',
  });
}

export function getCloudwatchTransport(prefix: string) {
  AWS.config.update({
    region: config.external.aws.region,
    credentials: new AWS.Credentials(
      config.external.aws.accessKeyId,
      config.external.aws.secretAccessKey
    ),
  });

  return new WinstonCloudwatch({
    logGroupName: config.external.aws.cloudwatch.logGroupName,
    logStreamName: prefix,
    messageFormatter: (log) =>
      `[${config.server.instanceName}] ${log.level}: ${log.message.trim()}`,
  });
}
