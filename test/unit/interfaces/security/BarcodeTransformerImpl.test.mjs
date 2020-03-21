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

import BarcodeTransformerImpl from '../../../../lib/interfaces/security/BarcodeTransformerImpl';

describe('# generateBarcodeFromId', () => {
  it('should fail with wrong id', async () => {
    expect(new BarcodeTransformerImpl().generateBarcodeFromId('hi201701562')).toBe(0);
  });

  it('should work', async () => {
    expect(new BarcodeTransformerImpl().generateBarcodeFromId(201701562)).toBe('1210209372');
    expect(new BarcodeTransformerImpl().generateBarcodeFromId(2017015620)).toBe('8068062480');
    expect(new BarcodeTransformerImpl().generateBarcodeFromId('201701562')).toBe('1210209372');
    expect(new BarcodeTransformerImpl().generateBarcodeFromId('2017015620')).toBe('8068062480');
  });
});

describe('# extractIdFromBarcode', () => {
  it('should fail with wrong barcode', async () => {
    expect(new BarcodeTransformerImpl().extractIdFromBarcode('iluseih2')).toBe(0);
  });

  it('should work', async () => {
    expect(new BarcodeTransformerImpl().extractIdFromBarcode(1210209372)).toBe(201701562);
    expect(new BarcodeTransformerImpl().extractIdFromBarcode(8068062480)).toBe(2017015620);
    expect(new BarcodeTransformerImpl().extractIdFromBarcode('1210209372')).toBe(201701562);
    expect(new BarcodeTransformerImpl().extractIdFromBarcode('8068062480')).toBe(2017015620);
  });
});
