/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2021 INU Global App Center <potados99@gmail.com>
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

import {logger} from '@inu-cafeteria/backend-core';

export default abstract class UseCase<ParamT = void, ResultT = void> {
  async run(params: ParamT): Promise<ResultT> {
    logger.verbose(
      `UseCase '${this.constructor.name}'를 다음 인자로 실행합니다: ${JSON.stringify(params)}`
    );

    return await this.onExecute(params);
  }

  abstract onExecute(params: ParamT): Promise<ResultT>;
}
