'use strict';

module.exports = (sequelize, DataTypes) => {

	sequelize.define('corner', {

		cafeteria_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		id: {
			type: DataTypes.INTEGER,
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
