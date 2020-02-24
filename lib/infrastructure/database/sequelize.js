'use strict';

const Sequelize = require('sequelize');


const seqConfig = __config.sequelizeConfig;

const sequelize = new Sequelize(
	seqConfig.database,
	seqConfig.username,
	seqConfig.password,
	seqConfig
);

sequelize.import('./models/Cafeteria');
sequelize.import('./models/Corner');
sequelize.import('./models/Menu');
sequelize.import('./models/MenuConvertKey');

module.exports = sequelize;
