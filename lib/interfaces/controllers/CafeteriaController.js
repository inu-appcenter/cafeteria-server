'use strict';

const Boom = require('@hapi/boom');

/**
 * Serializer
 */
const BaseSerializer = require('@domain/serializer/BaseSerializer');
const CafeteriaSerializer = require('@interfaces/serializers/CafeteriaSerializer');
const CornerSerializer = require('@interfaces/serializers/CornerSerializer');
const MenuSerializer = require('@interfaces/serializers/MenuSerializer');

/**
 * Use Cases
 */
 const GetCafeteria = require('@domain/usecases/GetCafeteria');
 const GetCorners = require('@domain/usecases/GetCafeteria');

/**
 * Repository
 */
const CafeteriaRepository = require('@domain/repositories/CafeteriaRepository');
const CafeteriaRepositoryImpl = require('@interfaces/storage/CafeteriaRepositoryImpl');

/**
 * Converter
 */
const MenuConverter = require('@domain/converter/MenuConverter');
const MenuConverterImpl = require('@interfaces/converter/MenuConverterImpl');

/**
 * Instances
 */
const menuConverter = new MenuConverter();
const cafeteriaRepositoryImpl = new CafeteriaRepositoryImpl(menuConverter);
const cafeteriaRepository = new CafeteriaRepository(cafeteriaRepositoryImpl);

const cafeteriaSerializer = new BaseSerializer(new CafeteriaSerializer());
const cornerSerializer = new BaseSerializer(new CornerSerializer());
const menuSerializer = new BaseSerializer(new MenuSerializer());


module.exports = {

	async getCafeteria(request) {

		const id = request.params.id;

		const result = await GetCafeteria({ id: id });

		if (!result) {
			return Boom.notFound();
		}

		return cafeteriaSerializer.serialize(result);
	},

	async getCorners(request) {

		const id = request.params.id; /* in the url */
		const cafeteriaId = request.query.cafeteriaId; /* after '?' */

		const result = await GetCorners({ id: id, cafeteriaId: cafeteriaId });

		if (!return) {
			return Boom.notFound();
		}

		return cornerSerializer.serialize(result);
	},

	async getMenus(request) {

		const cornerId = request.query.cornerId;
		const date = request.query.date;

		const result = await GetMenus({ cornerId: cornerId, date: date });

		if (!result) {
			return Boom.notFound();
		}

		return menuSerializer.serialize(result);
	}

};
