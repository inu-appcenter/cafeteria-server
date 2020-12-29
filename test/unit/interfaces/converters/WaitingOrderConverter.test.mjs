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

import WaitingOrderConverter from '../../../../lib/interfaces/converters/WaitingOrderConverter.mjs';
import CafeteriaRepositoryMock from '../../../mocks/CafeteriaRepositoryMock.mjs';

function getConverter() {
  return new WaitingOrderConverter({
    cafeteriaRepository: new CafeteriaRepositoryMock(),
  });
}

describe('# Convert incoming order input to WaitingOrder', () => {
  it('should use cafeteriaId when no posNumber given', async () => {
    const converter = getConverter();

    const result = await converter.convert({
      number: 9999,
      posNumber: undefined,
      cafeteriaId: 12,
      deviceIdentifier: 'abcd',
    });

    expect(result.cafeteriaId).toBe(12);
  });

  it('should use posNumber when given', async () => {
    const converter = getConverter();

    const result = await converter.convert({
      number: 9999,
      posNumber: 36,
      cafeteriaId: 12,
      deviceIdentifier: 'abcd',
    });

    expect(result.cafeteriaId).toBe(1/*due to mock repository, result will always be 1*/);
  });
});
