#!/usr/bin/env node

'use strict';

/**
 * Register module aliases.
 * See '_moduleAliases' in  package.json.
 */
require('module-alias/register');

const logger = require('@common/logger');
const sequelize = require('@infrastructure/database/sequelize');
const createServer = require('@infrastructure/webserver/server');

async function start() {

	// Sync DB.
	try {
		await sequelize.sync();

		logger.info('Connection to DB has been established successfully.');
	} catch (e) {
		logger.error('Unable to connect to the database:', e);
	}

	// Start server.
	try {
		const server = await createServer();
		await server.start();

		logger.info('Server running at: ' + server.info.uri);
	} catch (e) {
		logger.error(e);
		process.exit(1);
	}

}

start();
