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

import Injector from './Injector';
import logger from '../utils/logger';

const injector = new Injector();

let isInitialized = false;

export async function init(declaration, force=false, verbose=false) {
  if (!isInitialized || force) {
    await injector.init(declaration, verbose);

    logger.verbose('Injector initialized.');
    isInitialized = true;
  } else {
    logger.verbose('Ignore init.');
  }
}

export function override(classType, instance) {
  injector.mock(classType, instance);
}

export function overrideOnce(classType, instance) {
  injector.mockOnce(classType, instance);
}

export default function resolve(type) {
  logger.verbose(`Resolve '${type.name}'`);

  return injector.resolve(type);
}
