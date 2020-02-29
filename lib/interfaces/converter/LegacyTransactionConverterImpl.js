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

const DiscountTransaction = require('@domain/entities/DiscountTransaction');

/**
 * Convert legacy payment queries(barcode, code, menu, payment) to
 * domain DiscountTransaction object.
 */
module.exports = class {

	convert({ barcode, code, menu }, { barcodeTransformer }) {
		if (!barcode || !code || !menu) {
			return null;
		}

		const oldApiIdToCafeteriaId = {
			1: 4, /* 생활원식당 */
			2: 3, /* 사범대식당 */
		};

		const getType = (date) => {
			
		};

		return new DiscountTransaction({
			token: menu,
			mealType: getType(new Date()),

			userId: barcodeTransformer.extractIdFromBarcode(barcode),
			cafeteriaId: oldApiIdToCafeteriaId[code]
		});
	}

};
