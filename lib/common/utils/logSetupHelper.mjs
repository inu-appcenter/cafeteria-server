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

import config from '../../../config';

import stackTrace from 'stack-trace';
import winston from 'winston';
import path from 'path';

// This will add DailyRotateFile to winston.transports.
// It is needed. Do not remote this line.
// eslint-disable-next-line no-unused-vars
import _ from 'winston-daily-rotate-file';
import WinstonCloudwatch from 'winston-cloudwatch';
import AWS from 'aws-sdk';

const format = winston.format;

function getConsoleFormat() {
  return format.combine(format.colorize(), getFileFormat());
}

function getFileFormat() {
  return format.printf((info) =>
    `${info.timestamp} ${info.level}: ${info.message.trim()}`,
  );
}

function getConsoleTransport() {
  return new winston.transports.Console({
    format: getConsoleFormat(),
  });
}

function getFileTransport(prefix) {
  return new (winston.transports.DailyRotateFile)({
    format: getFileFormat(),
    filename: config.log.filepath(prefix),
    datePattern: 'YYYY-MM-DD',
  });
}

function getCloudwatchTransport(prefix) {
  AWS.config.update({
    region: config.aws.region,
    credentials: new AWS.Credentials(config.aws.accessKeyId, config.aws.secretAccessKey),
  });

  return new WinstonCloudwatch({
    logGroupName: config.aws.cloudwatch.logGroupName,
    logStreamName: prefix,
  });
}

function createLogger(transports) {
  return winston.createLogger({
    level: 'verbose',
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.json(),
    ),
    transports,
  });
}

function stringify(object) {
  if (object.stack) {
    // For error objects.
    return object.stack;
  } else if (object.toString) {
    // For those who can be string.
    return object.toString();
  } else if (object) {
    // For an object.
    return JSON.stringify(object);
  } else {
    // Invalid.
    return typeof object;
  }
}

function formatLog(message, showCaller=true) {
  const caller = stackTrace.get()[2]; /* to get a real caller */

  if (showCaller) {
    return `${path.basename(caller.getFileName())}:${caller.getFunctionName()}:${caller.getLineNumber()}:${caller.getColumnNumber()}: ${stringify(message)}`;
  } else {
    return `${stringify(message)}`;
  }
}

export default {
  getConsoleTransport,
  getFileTransport,
  getCloudwatchTransport,

  createLogger,

  stringify,
  formatLog,
};
