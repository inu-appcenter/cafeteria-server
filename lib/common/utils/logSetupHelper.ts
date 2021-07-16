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

import WinstonCloudwatch from 'winston-cloudwatch';
import stackTrace from 'stack-trace';
import {setupAWS} from '../../infrastructure/cloud/aws';
import winston from 'winston';
import TransportStream from 'winston-transport';

import path from 'path';

// winston.transports에 DailyRotateFile을 추가해 줍니다.
import _ from 'winston-daily-rotate-file';
_;

const format = winston.format;

function getConsoleFormat() {
  return format.combine(format.colorize(), getFileFormat());
}

function getFileFormat() {
  return format.printf((info) => `${info.timestamp} [${config.server.instanceName}] ${info.level}: ${info.message.trim()}`);
}

function getConsoleTransport() {
  return new winston.transports.Console({
    format: getConsoleFormat(),
  });
}

function getFileTransport(prefix: string) {
  return new winston.transports.DailyRotateFile({
    format: getFileFormat(),
    filename: config.log.filepath(prefix),
    datePattern: 'YYYY-MM-DD',
  });
}

function getCloudwatchTransport(prefix: string) {
  setupAWS();

  return new WinstonCloudwatch({
    logGroupName: config.aws.cloudwatch.logGroupName,
    logStreamName: prefix,
    messageFormatter: (log) => `[${config.server.instanceName}] ${log.level}: ${log.message.trim()}`,
  });
}

function createLogger(transports: TransportStream[]) {
  return winston.createLogger({
    level: 'verbose',
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.json()
    ),
    transports,
  });
}

function stringify(object: any) {
  if (object.stack) {
    // 에러 객체
    return object.stack;
  } else if (object.toString) {
    // 스트링이 될 수 있는 객체
    return object.toString();
  } else if (object) {
    // 그냥 객체
    return JSON.stringify(object);
  } else {
    // 이도저도 아님
    return typeof object;
  }
}

function formatLog(message: any, showCaller = true) {
  const caller = stackTrace.get()[2]; /* to get a real caller */

  if (showCaller) {
    return `${path.basename(
      caller.getFileName()
    )}:${caller.getFunctionName()}:${caller.getLineNumber()}:${caller.getColumnNumber()}: ${stringify(message)}`;
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
