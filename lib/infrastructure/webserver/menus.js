/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020  INU Appcenter <potados99@gmail.com>
 *
 * INU Cafeteria is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * INU Cafeteria is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
'use strict';

const CafeteriaController = require('@interfaces/controllers/CafeteriaController');
const Joi = require('@hapi/joi');

const BoomModel = require('./BoomModel');
const responseModel = Joi.object({
	'corner-id': Joi.number(),
	'foods': Joi.string(),
	'price': Joi.number(),
	'calorie': Joi.number()
}).label('Menu 모델');

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
					description: 'Menu를 요청합니다.',
					notes: ['스마트 캠퍼스 서버로부터 주어진 날짜의 식단 정보를 요청하여 가공한 뒤 직렬화하여 전달합니다.'],
					tags: ['api', 'menus'],
					validate: {
						query: Joi.object({
							date: Joi.string()
							.description('가져오고자 하는 Menu들의 날짜'),
							cornerId: Joi.number()
							.description('가져오고자 하는 Menu들이 속한 Corner의 id. 특정 코너의 식단만 가져오고 싶을 때에 유용합니다.')
						})
					},
					response: {
						status: {
							200: Joi.array().items(responseModel),
							400: BoomModel,
							500: BoomModel
						}
					}
				}
			}
		]);
	}
};
