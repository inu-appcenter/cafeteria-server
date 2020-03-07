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

import origin from '../lib/common/di/modules';

import CafeteriaRepository from '../lib/domain/repositories/CafeteriaRepository';
import CafeteriaRepositoryMock from './mocks/CafeteriaRepositoryMock';
import UserRepositoryMock from './mocks/UserRepositoryMock';
import UserRepository from '../lib/domain/repositories/UserRepository';

// Mocks here.
const overrides = [
  {
    create: async (r) => new CafeteriaRepositoryMock(),
    as: CafeteriaRepository,
  },
  {
    create: async (r) => new UserRepositoryMock(),
    as: UserRepository,
  },
];

const merged = origin.map((decl) => {
  const overrideFound = overrides.find((ov) => ov.as === decl.as);

  if (overrideFound) {
    return {
      create: overrideFound.create,
      as: overrideFound.as,
    };
  } else {
    return decl;
  }
});

export default merged;
