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

import ParseRegexRepository from '../../domain/repositories/ParseRegexrepository';
import ParseRegex from '../../domain/entities/ParseRegex';

class ParseRegexRepositoryImpl extends ParseRegexRepository {
  constructor({db}) {
    super();

    this.db = db;
    this.parseRegexModel = this.db.model('parse_regex');
  }

  async getAllExpressions() {
    const seqResults = await this.parseRegexModel.findAll();

    return seqResults.map((seqResult) => this._seqRegexToRegex(seqResult));
  }

  _seqRegexToRegex(seqRegex) {
    return new ParseRegex({
      id: seqRegex.id,
      regex: seqRegex.regex,
    });
  }
}

export default ParseRegexRepositoryImpl;
