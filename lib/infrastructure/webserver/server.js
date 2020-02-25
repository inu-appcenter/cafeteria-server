'use strict';

const Hapi = require('@hapi/hapi');

const serverConfig = require('@config/server-config');
const thisPackage = require('@root/package');

async function createServer() {
	const server = Hapi.server({
		port: serverConfig.port
	});

	await server.register([
		require('blipp'),
		require('@hapi/vision'),
		require('@hapi/inert'),
		{
			plugin: require('hapi-swagger'),
			options: {
				info: {
					title: 'API Documentation.',
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

	await server.register([
		require('@infrastructure/webserver/cafeteria'),
		require('@infrastructure/webserver/corners'),
		require('@infrastructure/webserver/menus')
	]);

	return server;
}

module.exports = createServer;
