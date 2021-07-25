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

import {appendQueryStringParameters} from '../../common/utils/url';
import qs from 'qs';
import logger from '../../common/logging/logger';
import {newAxiosInstance, newCookieJar} from '../../common/utils/axios';
import config from '../../../config';
import {imitateCupidCookie} from './pageScripts';

export type CoopRequestParams = {
  url: string;
  method: 'get' | 'post';
  searchParams?: Record<string, any>;
  data?: Record<string, any>;
};

export default class CoopWebsiteAccessor {
  constructor(private readonly params: CoopRequestParams) {}

  private jar = newCookieJar();
  private axios = newAxiosInstance(this.jar);

  async visit(): Promise<string> {
    const response = await this.request();

    if (response.includes('자동등록방지를 위해 보안절차를 거치고 있습니다.')) {
      await this.dodge(response);

      return await this.visit();
    } else {
      return response;
    }
  }

  private async request(): Promise<string> {
    const {url, method, searchParams, data} = this.params;

    const urlToRequest = appendQueryStringParameters(url, searchParams || {});

    const requestConfig = {
      url: urlToRequest,
      method: method,
      data: qs.stringify(data),
    };

    logger.verbose(
      `'${url}'에 ${method.toUpperCase()} 요청을 날립니다. body는 '${JSON.stringify(data)}'.`
    );

    const response = await this.axios.request(requestConfig);

    return response.data;
  }

  private async dodge(response: string) {
    logger.verbose('회피기동!');

    const cookie = imitateCupidCookie(response);

    await this.jar.setCookie(cookie, config.uicoop.domain);
    await this.axios.post(config.uicoop.verifyUrl);
  }
}
