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

import qs from 'qs';
import logger from '../../common/logging/logger';
import config from '../../../config';
import {imitateCupidCookie} from './embedded/pageScripts';
import {appendQueryStringParameters} from '../../common/utils/url';
import {newAxiosInstance, newCookieJar} from '../../common/utils/axios';

export type CoopRequestParams = {
  url: string;
  method: 'get' | 'post';
  searchParams?: Record<string, any>;
  data?: Record<string, any>;
};

/**
 * 생협 홈페이지에 별 탈 없이 요청을 보내고 응답을 받기 위해서는
 * Cafe24 방화벽을 뚫어야 합니다.
 *
 * 이 클래스가 그걸 해줍니다.
 * 매 요청마다 생성해서 쓰면 됩니다.
 */
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
