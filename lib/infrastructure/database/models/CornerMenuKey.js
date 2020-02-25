'use strict';

module.exports = (sequelize, DataTypes) => {

	sequelize.define('corner-menu-key', {

		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		TYPE1: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		TYPE2: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		FOODMENU_TYPE: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
	}, {
		// options
		timestamps: false
	});

};
