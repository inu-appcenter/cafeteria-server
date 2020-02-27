/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020  INU Appcenter <potados99@gmail.com>
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

const Hapi = require('@hapi/hapi');

const config = require('@config/config');
const thisPackage = require('@root/package');

async function createServer() {
	const server = Hapi.server({
		port: config.server.port
	});

	await server.register([
		require('blipp'),
		require('@hapi/vision'),
		require('@hapi/inert'),
		require('hapi-auth-cookie'),
		{
			plugin: require('hapi-swagger'),
			options: {
				info: {
					title: '카페테리아 서버 API',
					version: thisPackage.version
				}
			}
		},
		{
			plugin: require('@hapi/good'),
			options: {
				ops: {
					interval: 1000 * 60
				},
				reporters: {
					myConsoleReporter: [
						{
							module: '@hapi/good-squeeze',
							name: 'Squeeze',
							args: [{ ops: '*', log: '*', error: '*', response: '*'}]
						},
						{
							module: '@hapi/good-console'
						},
						'stdout'
					]
				}
			}
		}
	]);

	server.auth.strategy('standard', 'cookie', config.auth);

	await server.register([
		require('@infrastructure/webserver/cafeteria'),
		require('@infrastructure/webserver/corners'),
		require('@infrastructure/webserver/menus'),
		require('@infrastructure/webserver/user')
	]);

	return server;
}

module.exports = createServer;
