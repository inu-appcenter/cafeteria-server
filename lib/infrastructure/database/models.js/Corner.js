'use strict';

module.exports = (sequelize, DataTypes) => {

	sequelize.define('corner', {

		cafeteriaId: {
			type: DataTypes.INTERGER.UNSIGNED,
			allowNull: false
		},
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		// options
		timestamps: false
	});

};
