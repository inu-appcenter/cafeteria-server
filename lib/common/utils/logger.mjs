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

import getEnv from './env';
import logSetupHelper from './logSetupHelper';

const consoleTransport = logSetupHelper.getConsoleTransport();
const fileTransport = (prefix) => logSetupHelper.getFileTransport(prefix);
const combinedFileTransport = logSetupHelper.getFileTransport('combined');
const cloudwatchTransport = (prefix) => logSetupHelper.getCloudwatchTransport(prefix);
const combinedCloudwatchTransport = logSetupHelper.getCloudwatchTransport('combined');

function getLogger(prefix) {
  const transports = [
    consoleTransport,
  ];

  const productionTransports = [
    fileTransport(prefix),
    combinedFileTransport,
    cloudwatchTransport(prefix),
    combinedCloudwatchTransport,
  ];

  if (getEnv('NODE_ENV') === 'production') {
    transports.push(productionTransports);
  }

  const logger = logSetupHelper.createLogger(transports);

  logger.transports.forEach((transport) => {
    transport.silent = (getEnv('NODE_ENV') === 'tst');
  });

  return logger;
}

const loggers = {
  event: getLogger('event'),
  verbose: getLogger('verbose'),
  info: getLogger('info'),
  warn: getLogger('warn'),
  error: getLogger('error'),
};

export default {

  event(message) {
    loggers.event.info(
      logSetupHelper.formatLog(message, false),
    );
  },

  verbose(message) {
    loggers.verbose.verbose(
      logSetupHelper.formatLog(message),
    );
  },

  info(message) {
    loggers.info.info(
      logSetupHelper.formatLog(message),
    );
  },

  warn(message) {
    loggers.warn.warn(
      logSetupHelper.formatLog(message),
    );
  },

  error(message) {
    loggers.error.error(
      logSetupHelper.formatLog(message),
    );
  },

};
