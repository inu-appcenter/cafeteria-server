'use strict';

const CafeteriaController = require('@interfaces/controllers/CafeteriaController');

module.exports = {
	name: 'corners',
	version: '1.0.0',
	register: async (server) => {

		server.route([
			{
				method: 'GET',
				path: '/corners',
				handler: CafeteriaController.getCorners,
				options: {
					description: 'Get all corners',
					tags: ['api']
				}
			},
			{
				method: 'GET',
				path: '/corners/{id}',
				handler: CafeteriaController.getCorners,
				options: {
					description: 'Get corners by its {id}',
					tags: ['api']
				}
			}
		]);
	}
};
