'use strict';

module.exports = (sequelize, DataTypes) => {

	sequelize.define('cafeteria', {

		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		imagePath: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		// options
		timestamps: false
	});

};
