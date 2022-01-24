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

import fetch, {RequestInfo, RequestInit} from 'node-fetch';

export function fetchWithTimeout(
  url: RequestInfo,
  options: RequestInit,
  timeout: number = 5000
): Promise<Response> {
  const fetched = fetch(url, options);
  const timedOut = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('요청 타임아웃!!')), timeout)
  );

  // @ts-ignore
  return Promise.race([fetched, timedOut]);
}

export async function postUrlencoded(
  url: RequestInfo,
  body: Record<string, any> | string,
  headers: Record<string, any> = {}
) {
  const response = await fetchWithTimeout(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      ...headers,
    },
    body: typeof body === 'string' ? body : new URLSearchParams(body).toString(),
  });

  return response.text();
}

export async function postJson(
  url: RequestInfo,
  body: Record<string, any>,
  headers: Record<string, any> = {}
) {
  const response = await fetchWithTimeout(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  });

  return response.text();
}
