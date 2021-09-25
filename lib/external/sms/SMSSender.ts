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

import {postJson} from '../../common/utils/fetch';
import {generateUUIDHex} from '../../common/utils/uuid';
import {createHmac} from 'crypto';
import config from '../../../config';
import {logger} from '@inu-cafeteria/backend-core';

export type SMSParams = {
  sender: string;
  recipient: string;
  body: string;
};

export default class SMSSender {
  constructor(private readonly params: SMSParams) {}

  async send(): Promise<boolean> {
    const {sender, recipient, body} = this.params;

    const payload = {
      message: {
        from: sender,
        to: recipient,
        text: body,
      },
    };

    logger.info(`SMS를 보냅니다. 요청 페이로드는 ${JSON.stringify(payload)}`);

    const headers = this.generateAuthHeader();

    const responseText = await postJson(
      'https://api.coolsms.co.kr/messages/v4/send',
      payload,
      headers
    );

    logger.info(`응답이 왔습니다: ${responseText}`);

    return responseText.includes('정상 접수');
  }

  private generateAuthHeader() {
    const {key, secret} = config.external.sms.auth;

    const date = new Date().toISOString();
    const salt = generateUUIDHex();
    const data = date + salt;

    const signature = createHmac('sha256', secret).update(data).digest('hex');

    return {
      Authorization: `HMAC-SHA256 ApiKey=${key}, Date=${date}, salt=${salt}, signature=${signature}`,
    };
  }
}
