'use strict';

module.exports = (sequelize, DataTypes) => {

	sequelize.define('cafeteria', {

		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		image_path: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		// options
		timestamps: false
	});

};
