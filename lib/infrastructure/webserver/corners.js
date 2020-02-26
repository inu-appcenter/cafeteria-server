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
	'id': Joi.number(),
	'name': Joi.string(),
	'cafeteria-id': Joi.number()
}).label('Corner 모델');

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
					description: '모든 Corner의 배열을 요청합니다.',
					notes: ['corners 테이블의 열을 모두 읽은 뒤 직렬화하여 전달합니다.'],
					tags: ['api', 'corners'],
					validate: {
						query: Joi.object({
							cafeteriaId: Joi.number()
							.description('해당 Corner가 속한 Cafeteria의 id.')
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
			},
			{
				method: 'GET',
				path: '/corners/{id}',
				handler: CafeteriaController.getCorners,
				options: {
					description: '지정된 id를 가지는 Corner를 요청합니다.',
					notes: ['corners 테이블에서 주어진 id를 가지는 열을 읽은 뒤 직렬화하여 전달합니다.'],
					tags: ['api', 'corners'],
					validate: {
						params: Joi.object({
							id: Joi.number()
							.required()
							.description('Corner의 id.')
						})
					},
					response: {
						status: {
							200: responseModel,
							400: BoomModel,
							500: BoomModel
						}
					}
				}
			}
		]);
	}
};
