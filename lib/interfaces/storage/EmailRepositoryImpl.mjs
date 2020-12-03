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

import EmailRepository from '../../domain/repositories/EmailRepository';
import nodemailer from 'nodemailer';
import config from '../../../config';
import logger from '../../common/utils/logger';

class EmailRepositoryImpl extends EmailRepository {
  constructor() {
    super();
  }

  async sendEmail(params) {
    if (!config.mail.auth.user || !config.mail.auth.pass) {
      logger.warn('No smtp authentication! Cannot send email.');
      return;
    }

    const transport = nodemailer.createTransport({
      service: 'mailgun',
      auth: config.mail.auth,
    });

    const message = {
      from: params.from,
      to: params.to,
      subject: params.title,
      html: params.body,
    };

    try {
      const result = await transport.sendMail(message);

      logger.info(`Mail sent to '${params.to}': ${result.response}.`);
    } catch (e) {
      logger.error(`Error while sending email: ${e.message}`);
    }
  }
}

export default EmailRepositoryImpl;
