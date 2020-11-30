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

import UseCase from './UseCase';
import logger from '../../common/utils/logger';

class CheckIfUserShouldUpdateApp extends UseCase {
  constructor({appVersionRuleRepo: appVersionRuleRepository}) {
    super();

    this.appVersionRuleRepository = appVersionRuleRepository;
  }

  async onExecute({os, version}) {
    const minVersion = await this.appVersionRuleRepository.getRequiredMinimumVersion(os);
    if (!minVersion) {
      logger.warn(`No required version info found for os '${os}'!`);
      return false;
    }

    logger.info(`User's version is ${version}, and required version is ${minVersion}.`);
    const needToUpdate = version < minVersion;

    if (needToUpdate) {
      logger.info(`User have to update from ${version} to ${minVersion}.`);
    } else {
      logger.info(`User can stick to current version ${version}.`);
    }

    return needToUpdate;
  }
}

export default CheckIfUserShouldUpdateApp;
