'use strict';

const MenuConverter = require('@application/converter/MenuConverter');
const MenuConverterImpl = require('@interfaces/converter/MenuConverterImpl');

const CafeteriaRepository = require('@application/repositories/CafeteriaRepository');
const CafeteriaRepositoryImpl = require('@interfaces/storage/CafeteriaRepositoryImpl');

describe('# Cafeteria repository', () => {
	it('should get menus', async () => {

		const converter = new MenuConverter(new MenuConverterImpl());
		const repo = new CafeteriaRepository(new CafeteriaRepositoryImpl(converter));

		const result = await repo.getAllMenus('20200219');

		expect(result).toBe([]);
	});
});
