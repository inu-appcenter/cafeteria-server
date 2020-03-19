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

import BarcodeTransformer from '../../lib/domain/security/BarcodeTransformer';

/**
 * For unknown reason, setting BarcodeTransformerMock.mjs as a filename
 * makes a problem: the file is not recognized by the IDE as a js source file.
 */
class BarcodeTransformerMock extends BarcodeTransformer {
  generateBarcodeWithId(id) {
    return 'my-barcode';
  }

  extractIdFromBarcode(barcode) {
    return '201701562';
  }
}

export default BarcodeTransformerMock;
