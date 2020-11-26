/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020 INU Global App Center <potados99@gmail.com>
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

import BarcodeTransformer from '../../domain/security/BarcodeTransformer';

class BarcodeTransformerImpl extends BarcodeTransformer {
  generateBarcodeFromId(id) {
    if (!id || isNaN(id)) {
      return 0;
    }

    const generate = (id) => {
      const digitsOfId = id.toString().length;

      switch (digitsOfId) {
        case 9:
          return id * 6;
        case 10:
          return id * 4;
      }
    };

    return generate(id).toString();
  }

  extractIdFromBarcode(barcode) {
    if (!barcode || isNaN(barcode)) {
      return 0;
    }

    const decode = (barcode) => {
      const digitsOfId = (barcode < 2*(10**9)) ? 9 : 10;

      switch (digitsOfId) {
        case 9:
          return barcode / 6;
        case 10:
          return barcode / 4;
      }
    };

    return Number.parseInt(decode(barcode)); // Make it integer, not float.
  }
}

export default BarcodeTransformerImpl;
