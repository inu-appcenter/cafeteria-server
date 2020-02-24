'use strict';

module.exports = (sequelize, DataTypes) => {

	sequelize.define('corner-menu-key', {

		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			primaryKey: true
		},
		TYPE1: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		},
		TYPE2: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		},
		FOODMENU_TYPE: {
			type: DataTypes.INTERGER.UNSIGNED,
			allowNull: false
		},
	}, {
		// options
		timestamps: false
	});

};
