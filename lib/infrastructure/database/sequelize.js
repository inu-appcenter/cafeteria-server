'use strict';

const Sequelize = require('sequelize');
const seqConfig = require('@config/seq-config');

const sequelize = new Sequelize(
	seqConfig.database,
	seqConfig.username,
	seqConfig.password,
	seqConfig
);

const models = {
	Cafeteria: sequelize.import('./models/Cafeteria'),
	Corner: sequelize.import('./models/Corner')
};

models.Corner.belongsTo(models.Cafeteria, { foreignKey: 'cafeteria_id' });

module.exports = sequelize;
