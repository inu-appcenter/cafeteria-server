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
import SendEmail from '../../domain/usecases/SendEmail';
import EmailParams from '../../domain/entities/EmailParams';
import config from '../../../config';

export default {

  async ask(request, h) {
    const {id} = request.auth.credentials;
    const {deviceInfo, version, content} = request.payload;

    if (content.length > config.question.lengthLimit) {
      return Boom.badRequest(`Length of content cannot exceed ${config.question.lengthLimit}!`);
    }

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
      // Do not await! return quickly.
      sendNewQuestionNotificationToAdmin(question).then().catch().finally();

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
    const {unreadOnly} = request.query; // Default false.

    const answers = await resolve(GetAnswers).run({userId: id, unreadOnly: unreadOnly});

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

async function sendNewQuestionNotificationToAdmin(question) {
  await resolve(SendEmail).run(
    new EmailParams({
      from: config.mail.sender,
      to: config.mail.addresses.admin,
      title: '새로운 문의가 등록되었습니다.',
      body: composeNotificationMailBody(question),
    }),
  );
}

function composeNotificationMailBody(question) {
  // https://html5-editor.net
  return `
        <!-- #######  THIS IS A COMMENT - Visible only in the source editor #########-->
        <p>새로운 문의가 등록되었습니다.</p>

        <table style="width: 356px; height: 89px; border: 0px;">
           <tbody>
              <tr style="height: 23px;">
                 <td style="width: 133.203125px; height: 23px; border: 0px;"><span style="color: #808080;">작성자</span></td>
                 <td style="width: 212.8125px; height: 23px; border: 0px;">${question.userId}</td>
              </tr>
              <tr style="height: 23px;">
                 <td style="width: 133.203125px; height: 23px; border: 0px;"><span style="color: #808080;">문의 시각</span></td>
                 <td style="width: 212.8125px; height: 23px; border: 0px;">${new Date().toLocaleString()}</td>
              </tr>
              <tr>
                 <td style="width: 133.203125px; border: 0px;"><span style="color: #808080;">기기 정보</span></td>
                 <td style="width: 212.8125px; border: 0px;">${question.deviceInfo}</td>
              </tr>
              <tr style="height: 23px;">
                 <td style="width: 133.203125px; height: 23px; border: 0px;"><span style="color: #808080;">앱 버전</span></td>
                 <td style="width: 212.8125px; height: 23px; border: 0px;">${question.version}</td>
              </tr>
           </tbody>
        </table>
        <div style="margin: 3px;">
           <p><span style="color: #808080;">문의 내용</span></p>
           <pre>${question.content}</pre>
           <h3><strong><a style="color: #ff6600;" href="https://manage.inu-cafeteria.app/#/Questions">답변하기</a></strong></h3>
        </div>
    `;
}
