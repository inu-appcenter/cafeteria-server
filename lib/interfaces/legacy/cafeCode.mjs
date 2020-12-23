import config from '../../../config.mjs';
import logger from '../../common/utils/logger.mjs';

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

export default function cafeCodeToCafeteriaId(cafeCode) {
  const oldApiIdToCafeteriaId = config.transaction.oldApiIdToCafeteriaId;

  if (oldApiIdToCafeteriaId[cafeCode] === undefined) {
    logger.warn(`No such cafeteria exists for cafeCode '${cafeCode}'!`);
  }

  return oldApiIdToCafeteriaId[cafeCode] || -1;
}
