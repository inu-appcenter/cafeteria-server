import stackTrace from 'stack-trace';
import path from 'path';

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

export function stringify(object: any) {
  if (object.stack) {
    // 에러 객체
    return object.stack;
  } else if (object.toString) {
    // 스트링이 될 수 있는 객체
    return object.toString();
  } else if (object) {
    // 그냥 객체
    return JSON.stringify(object);
  } else {
    // 이도저도 아님
    return typeof object;
  }
}

export function formatLog(message: any, showCaller = true) {
  const caller = stackTrace.get()[2]; /* to get a real caller */

  if (showCaller) {
    return `${path.basename(
      caller.getFileName()
    )}:${caller.getFunctionName()}:${caller.getLineNumber()}:${caller.getColumnNumber()}: ${stringify(
      message
    )}`;
  } else {
    return `${stringify(message)}`;
  }
}
