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
import config from '../../../config';
import MailSender from '../../external/mail/MailSender';

export type NotifyNewQuestionParams = {
  studentId: string;
  deviceInfo: string;
  appVersion: string;
  content: string;
};

class NotifyNewQuestion extends UseCase<NotifyNewQuestionParams, void> {
  async onExecute(params: NotifyNewQuestionParams): Promise<void> {
    const emailParams = {
      from: config.mail.sender,
      to: config.mail.addresses.admin,
      title: '새로운 문의가 등록되었습니다.',
      body: this.composeNotificationMailBody(params),
    };

    await new MailSender(emailParams).send();
  }

  private composeNotificationMailBody(params: NotifyNewQuestionParams) {
    // https://html5-editor.net
    return `
        <!-- #######  THIS IS A COMMENT - Visible only in the source editor #########-->
        <p>새로운 문의가 등록되었습니다.</p>

        <table style="width: 356px; height: 89px; border: 0px;">
           <tbody>
              <tr style="height: 23px;">
                 <td style="width: 133.203125px; height: 23px; border: 0px;"><span style="color: #808080;">작성자</span></td>
                 <td style="width: 212.8125px; height: 23px; border: 0px;">${params.studentId}</td>
              </tr>
              <tr style="height: 23px;">
                 <td style="width: 133.203125px; height: 23px; border: 0px;"><span style="color: #808080;">문의 시각</span></td>
                 <td style="width: 212.8125px; height: 23px; border: 0px;">${new Date().toLocaleString()}</td>
              </tr>
              <tr>
                 <td style="width: 133.203125px; border: 0px;"><span style="color: #808080;">기기 정보</span></td>
                 <td style="width: 212.8125px; border: 0px;">${params.deviceInfo}</td>
              </tr>
              <tr style="height: 23px;">
                 <td style="width: 133.203125px; height: 23px; border: 0px;"><span style="color: #808080;">앱 버전</span></td>
                 <td style="width: 212.8125px; height: 23px; border: 0px;">${params.appVersion}</td>
              </tr>
           </tbody>
        </table>
        <div style="margin: 3px;">
           <p><span style="color: #808080;">문의 내용</span></p>
           <pre>${params.content}</pre>
           <h3><strong><a style="color: #ff6600;" href="https://console.inu-cafeteria.app/#/Questions">답변하기</a></strong></h3>
        </div>
    `;
  }
}

export default new NotifyNewQuestion();
