'use strict';

const Sequelize = require('sequelize');
const seqConfig = require('@config/seq-config');

const sequelize = new Sequelize(
	seqConfig.database,
	seqConfig.username,
	seqConfig.password,
	seqConfig
);

sequelize.import('./models/Cafeteria');
sequelize.import('./models/Corner');

module.exports = sequelize;
