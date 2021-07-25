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
import {UserIdentifier} from '../user/Types';
import {Answer} from '@inu-cafeteria/backend-core';

class GetUnreadAnswers extends UseCase<UserIdentifier, Answer[]> {
  async onExecute({userId}: UserIdentifier): Promise<Answer[]> {
    // Answer에는 userId가 없어 Question과의 join을 통해야 합니다.

    return await Answer.createQueryBuilder('answer')
      .innerJoin('answer.question', 'question') // question 필드에 join을 찰싹.
      .where('question.userId = :userId', {userId}) // 그 question의 userId로 필터.
      .andWhere('answer.read = :read', {read: false}) // 물론 answer는 unread인 것만.
      .getMany(); // 마니마니챙겨와
  }
}

export default new GetUnreadAnswers();
