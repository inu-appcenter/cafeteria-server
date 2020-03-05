/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020 INU Appcenter <potados99@gmail.com>
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
'use strict';

import config from 'root/lib/config/config';

import stackTrace from 'stack-trace';
import winston from 'winston';

// This will add DailyRotateFile to winston.transports.
import _ from 'winston-daily-rotate-file';

// Formats
const format = winston.format;

// Format for those written to file.
const fileFormat = format.printf((info) =>
  `${info.timestamp} ${info.level}: ${info.message.trim()}`,
);

// Format for those printed to console.
const consoleFormat = format.combine(format.colorize(), fileFormat);

// Transport to console.
const consoleTransport = new winston.transports.Console({
  format: consoleFormat,
});

// Create a transport to file.
function getFileTransport(prefix) {
  return new (winston.transports.DailyRotateFile)({
    format: fileFormat,
    filename: config.log.file.name(prefix),
    datePattern: config.log.file.datePattern,
  });
}

// Get a logger with prefix(to be used as a directory name)
function getLogger(prefix) {
  return winston.createLogger({
    format: format.combine(
        format.timestamp({
          format: config.log.timestamp,
        }),
        format.json(),
    ),
    transports: [
      consoleTransport,
      getFileTransport(prefix),
    ],
  });
}

// Extract an adequate string from an object.
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

// Format a log, using stack trace to extract a caller info.
function formatLog(message, showCaller=true) {
  const caller = stackTrace.get()[2]; /* to get a real caller */

  if (showCaller) {
    return `${caller.getFileName()}:${caller.getFunctionName()}:${caller.getLineNumber()}:${caller.getColumnNumber()}: ${stringify(message)}`;
  } else {
    return `${stringify(message)}`;
  }
}

// All loggers here.
const loggers = {
  event: getLogger('event'),
  verbose: getLogger('verbose'),
  info: getLogger('info'),
  warn: getLogger('warn'),
  error: getLogger('error'),
};

module.exports = {

  event(message) {
    loggers.event.info(
        formatLog(message, false),
    );
  },

  verbose(message) {
    loggers.verbose.verbose(
        formatLog(message),
    );
  },

  info(message) {
    loggers.info.info(
        formatLog(message),
    );
  },

  warn(message) {
    loggers.warn.warn(
        formatLog(message),
    );
  },

  error(message) {
    loggers.error.error(
        formatLog(message),
    );
  },

};
