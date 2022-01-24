/**
 * This file is part of INU Cafeteria.
 *
 * Copyright 2021 INU Global App Center <potados99@gmail.com>
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
import {UserIdentifier} from '../user/common/types';
import {Answer} from '@inu-cafeteria/backend-core';

export type GetAnswersParams = UserIdentifier & {
  unreadOnly?: boolean;
};

class GetAnswers extends UseCase<GetAnswersParams, Answer[]> {
  async onExecute({userId, unreadOnly}: GetAnswersParams): Promise<Answer[]> {
    // find option으로 하는거? 안돼요
    // https://github.com/typeorm/typeorm/issues/2707

    const query = Answer.createQueryBuilder('answer')
      .innerJoin('answer.question', 'question')
      .where('question.userId = :userId', {userId});

    if (unreadOnly) {
      query.andWhere('answer.read = :read', {read: false});
    }

    return await query.getMany();
  }
}

export default new GetAnswers();
