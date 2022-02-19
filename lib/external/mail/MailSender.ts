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

import NodeMailer from 'nodemailer';
import config from '../../../config';
import {logger, stringifyError} from '@inu-cafeteria/backend-core';

export type SendMailParams = {
  from: string;
  to: string;

  title: string;
  body: string;
};

export default class MailSender {
  constructor(private readonly params: SendMailParams) {}

  private transport = NodeMailer.createTransport({
    service: 'mailgun',
    auth: config.external.mail.auth,
  });

  async send(): Promise<void> {
    try {
      const result = await this.transport.sendMail({
        from: this.params.from,
        to: this.params.to,
        subject: this.params.title,
        html: this.params.body,
      });

      logger.info(`${this.params.to}에게 메일 전송 완료: ${result.response}`);
    } catch (e) {
      logger.error(`이메일 전송 실패: ${stringifyError(e)}`);
    }
  }
}
