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

import resolve from '../../common/di/resolve';

import QuestionConverter from '../converters/QuestionConverter';
import Ask from '../../domain/usecases/Ask';

import Boom from '@hapi/boom';
import GetAnswers from '../../domain/usecases/GetAnswers';
import AnswerSerializer from '../serializers/AnswerSerializer';
import GetQuestions from '../../domain/usecases/GetQuestions';
import QuestionSerializer from '../serializers/QuestionSerializer';
import MarkAnswerRead from '../../domain/usecases/MarkAnswerRead';

export default {

  async ask(request, h) {
    const {id} = request.auth.credentials;
    const {deviceInfo, version, content} = request.payload;

    const question = resolve(QuestionConverter).convert({
      deviceInfo: deviceInfo,
      version: version,
      content: content,
      userId: id,
    });

    const result = await resolve(Ask).run({
      question: question,
    });

    if (result) {
      return h.response().code(201); /* send nothing */
    } else {
      return Boom.badImplementation('WHAT??');
    }
  },

  async getQuestions(request) {
    const {id} = request.auth.credentials;

    const questions = await resolve(GetQuestions).run({userId: id});

    return resolve(QuestionSerializer).serialize(questions);
  },

  async getAnswers(request) {
    const {id} = request.auth.credentials;
    const {unread} = request.query;

    const answers = await resolve(GetAnswers).run({userId: id, unread: unread});

    return resolve(AnswerSerializer).serialize(answers);
  },

  async markAnswerRead(request, h) {
    const {answerId} = request.params;

    const result = await resolve(MarkAnswerRead).run({answerId});

    if (result) {
      return h.response().code(204);
    } else {
      return Boom.badRequest();
    }
  },

};
