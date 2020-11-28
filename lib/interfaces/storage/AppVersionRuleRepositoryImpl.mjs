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

import AppVersionRuleRepository from '../../domain/repositories/AppVersionRuleRepository';
import AppVersionRule from '../../domain/entities/AppVersionRule';
import logger from '../../common/utils/logger';

class AppVersionRuleRepositoryImpl extends AppVersionRuleRepository {
  constructor({db}) {
    super();

    this.db = db;
    this.appVersionRuleModel = this.db.model('app_version_rule');
  }

  async getRequiredMinimumVersion(os) {
    if (!os) {
      return false;
    }

    const seqRule = await this.appVersionRuleModel.findOne({
      where: {os: os.toLowerCase()},
    });

    if (!seqRule) {
      logger.warn(`No app version rule for that os: '${os}'`);
    }

    const appVersionRuleForThatOs = this._seqRuleToRule(seqRule);

    return appVersionRuleForThatOs.requiredMinimumVersion;
  }

  _seqRuleToRule(seqRule) {
    return new AppVersionRule({
      id: seqRule.id,
      os: seqRule.os,
      requiredMinimumVersion: seqRule.required_minimum_version,
    });
  }
}

export default AppVersionRuleRepositoryImpl;
