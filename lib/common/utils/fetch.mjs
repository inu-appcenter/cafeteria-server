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

import fetch from 'node-fetch';
import {URLSearchParams} from 'url';

function _isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function _serialize(obj) {
  const str = [];
  for (const p in obj) {
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  }
  return str.join('&');
}

function _createUrl(url, options) {
  return _isEmpty(options) ? url : (url + (url.includes('?') ? '&' : '?') + _serialize(options));
}

function _createSearchParams(body) {
  const params = new URLSearchParams();

  Object.keys(body).forEach((key) => {
    params.append(key, body[key]);
  });

  return params;
}

function fetchWithTimeout(url, options, timeout = 10000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), timeout),
    ),
  ]);
}

export default {

  async getJson(url, options={}) {
    const queryUrl = _createUrl(url, options);

    const response = await fetchWithTimeout(queryUrl);
    return response.json();
  },

  async getHtml(url, options={}) {
    const queryUrl = _createUrl(url, options);

    const response = await fetchWithTimeout(queryUrl);
    return response.text();
  },

  async postAndGetResponseText(url, body={}) {
    // x-www-form-urlencoded
    const params = _createSearchParams(body);

    const response = await fetchWithTimeout(url, {method: 'POST', body: params});
    return response.text();
  },

};
