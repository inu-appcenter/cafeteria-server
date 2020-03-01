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

// TODO dirty. Clean it up.

const config = require('@config/config');

const winston = require('winston');
const format = winston.format;
const print = winston.print;

require('winston-daily-rotate-file');

const fileFormat = format.printf(info =>
	`${info.timestamp} ${info.level}: ${info.message.trim()}`
);

const consoleFormat = format.combine(
  format.colorize(),
  fileFormat
);

const consoleTransport = new winston.transports.Console({
	format: consoleFormat
});

function getFileTransport(prefix) {
	return new (winston.transports.DailyRotateFile)({
		format: fileFormat,
		filename: config.log.file.name(prefix),
		datePattern: config.log.file.datePattern
	});
}

function getLogger(prefix) {
	return winston.createLogger({
		format: format.combine(
			format.timestamp({
				format: config.log.timestamp
			}),
			format.json()
		),
		transports: [
			consoleTransport,
			getFileTransport(prefix)
		]
	});
}

const loggers = {
	event: getLogger('event'),
	info: getLogger('info'),
	warn: getLogger('warn'),
	error: getLogger('error')
};

loggers.info.info('Logger initiated.');

module.exports = {

	event(message, tag) {
		loggers.event.info(`${tag.toString() + (tag ? ': ' : '')}${message.toString()}`);
	},

	info(message, tag) {
		loggers.info.info(`${tag.toString() + (tag ? ': ' : '')}${message.toString()}`);
	},

	warn(message, tag) {
		loggers.warn.warn(`${tag.toString() + (tag ? ': ' : '')}${message.toString()}`);
	},

	error(message, tag) {
		loggers.error.error(`${tag.toString() + (tag ? ': ' : '')}${message.toString()}`);
	}

};
