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

import Question from '../entities/Question';
import Answer from '../entities/Answer';

export default abstract class InteractionRepository {
  abstract ask(question: Question): Promise<void>;

  abstract getAllQuestions(userId: number /* TODO userId */): Promise<Question[]>;

  abstract getAllAnswers(userId: number /* TODO userId */): Promise<Answer[]>;
  abstract getUnreadAnswers(userId: number /* TODO userId */): Promise<Answer[]>;

  abstract markAnswerRead(answerId: number): Promise<void>;
}
