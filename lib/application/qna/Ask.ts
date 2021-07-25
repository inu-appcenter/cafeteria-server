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

import UseCase from '../../common/base/UseCase';
import {Question, User} from '@inu-cafeteria/backend-core';
import {UserIdentifier} from '../user/Types';

export type AskParams = {
  deviceInfo: string;
  appVersion: string;
  content: string;
} & UserIdentifier;

class Ask extends UseCase<AskParams, void> {
  async onExecute({userId, deviceInfo, appVersion, content}: AskParams): Promise<void> {
    const question = Question.create({
      userId,
      deviceInfo,
      appVersion,
      content,
      askedAt: new Date(),
    });

    await question.save();
  }
}

export default new Ask();
