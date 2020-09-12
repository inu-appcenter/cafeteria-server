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

import tough from 'tough-cookie';
import axios from 'axios';
import commonJsModules from './cjs';
const {axiosCookieJarSupport} = commonJsModules;

function newAxiosInstance() {
  const jar = new tough.CookieJar();

  const axiosInstance = axios.create({
    validateStatus: false,
  });

  axiosCookieJarSupport(axiosInstance);

  axiosInstance.defaults.jar = jar;
  axiosInstance.defaults.withCredentials = true;

  return axiosInstance;
}

export default newAxiosInstance;
