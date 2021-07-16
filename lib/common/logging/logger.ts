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

import TransportStream from 'winston-transport';
import logSetupHelper from './logSetupHelper';
import config from '../../../config';

const consoleTransport = logSetupHelper.getConsoleTransport();
const fileTransport = (prefix: string) => logSetupHelper.getFileTransport(prefix);
const combinedFileTransport = logSetupHelper.getFileTransport('combined');
// const cloudwatchTransport = (prefix: string) => logSetupHelper.getCloudwatchTransport(prefix);
// const combinedCloudwatchTransport = logSetupHelper.getCloudwatchTransport('combined');

function getLogger(prefix: string) {
  const transports: TransportStream[] = [consoleTransport, fileTransport(prefix), combinedFileTransport];
  const productionTransports: TransportStream[] = [/*cloudwatchTransport(prefix), combinedCloudwatchTransport*/];

  if (config.isProduction) {
    productionTransports.forEach((tp) => {
      transports.push(tp);
    });
  }

  const logger = logSetupHelper.createLogger(transports);

  logger.transports.forEach((transport) => {
    transport.silent = config.isTest;
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
  event(message: any) {
    loggers.event.info(logSetupHelper.formatLog(message, false));
  },

  verbose(message: any) {
    loggers.verbose.verbose(logSetupHelper.formatLog(message));
  },

  info(message: any) {
    loggers.info.info(logSetupHelper.formatLog(message));
  },

  warn(message: any) {
    loggers.warn.warn(logSetupHelper.formatLog(message));
  },

  error(message: any) {
    loggers.error.error(logSetupHelper.formatLog(message));
  },
};
