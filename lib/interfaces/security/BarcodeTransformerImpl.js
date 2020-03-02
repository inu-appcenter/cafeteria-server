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

module.exports = class {
  generateBarcodeWithId(id) {
    const generate = (id) => {
      if (id.length === 10) {
        return id * 4;
      } else {
        return id * 6;
      }
    };

    return generate(id);
  }

  extractIdFromBarcode(barcode) {
    const decode = (barcode) => {
      if (barcode < 2000000000) {
        return barcode / 6;
      } else {
        return barcode / 4;
      }
    };

    return decode(barcode);
  }
};
