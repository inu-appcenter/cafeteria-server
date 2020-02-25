'use strict';

const Hapi = require('@hapi/hapi');

const serverConfig = require('@config/server-config');
const package = require('@root/package');

async function createServer() {
	const server = Hapi.server({
		port: serverConfig.port
	});

	await server.register([
		require('blipp'),
		require('@hapi/vision'),
		{
			plugin: require('hapi-swagger'),
			options: {
				info: {
					title: 'API Documentation.',
					version: package.version
				}
			}
		},
		{
			plugin: requier('@hapi/good'),
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
		require('@infrastructure/webserver/corner'),
		require('@infrastructure/webserver/menu')
	]);

	return server;
}

module.exports = createServer;
