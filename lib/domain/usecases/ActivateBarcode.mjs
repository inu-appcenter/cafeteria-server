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

/**
 * The parameter 'userId' is named that way, not 'id',
 * because it is hard to remind that the 'id' is a property of a User.
 */

import UseCase from './UseCase';
import logger from '../../common/utils/logger';

/**
 * A use case that activates a barcode.
 */
class ActivateBarcode extends UseCase {
  constructor({transactionRepository}) {
    super();
    this.transactionRepository = transactionRepository;
  }

  onExecute({userId}) {
    logger.info(`${userId} activating: barcode`);

    return this.transactionRepository.tryActivateBarcode(userId);
  }
}

export default ActivateBarcode;
