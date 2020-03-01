/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020 INU Appcenter <potados99@gmail.com>
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

jest.mock('@config/config', () => require('@test/config'));

const logger = require('@common/logger');

const LegacyTransactionConverter = require('@domain/converters/LegacyTransactionConverter');
const LegacyTransactionConverterImpl = require('@interfaces/converters/LegacyTransactionConverterImpl');

const BarcodeTransformer = require('@domain/security/BarcodeTransformer');

describe('# Legacy transaction converter', () => {

	it('should convert', async () => {
		const TAG = 'should convert';

		const barcodeTransformer = new BarcodeTransformer({
			extractIdFromBarcode(barcode) {
				return '201701562';
			}
		});
		const converter = new LegacyTransactionConverter(new LegacyTransactionConverterImpl(barcodeTransformer));

		const inputQuery = {
			barcode: '12345678',
			code: 1,
			menu: 'blahblah'
		};

		const converted = converter.convert(inputQuery);

		logger.info(converted, TAG);

	});
});
