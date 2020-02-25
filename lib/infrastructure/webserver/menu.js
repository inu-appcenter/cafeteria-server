'use strict';

const CafeteriaController = require('@interfaces/controllers/CafeteriaController');

module.exports = {
	name: 'menus',
	version: '1.0.0',
	register: async (server) => {

		server.route([
			{
				method: 'GET',
				path: '/menus',
				handler: CafeteriaController.getMenus,
				options: {
					description: 'Get all menus',
					tags: ['api']
				}
			}
		]);
	}
};
