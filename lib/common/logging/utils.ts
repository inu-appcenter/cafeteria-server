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

import path from 'path';
import {wrapCallSite} from 'source-map-support';

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
  // source-map-support 의 매핑을 활용합니다.
  Error.prepareStackTrace = (_, stack) => stack.map((s) => wrapCallSite(s));
  const error = new Error();
  const stack = error.stack as unknown as StackFrame[];
  Error.prepareStackTrace = undefined;

  const caller = stack[2]; /* 진짜 caller는 2에 있음! */
  const payload = stringify(message);

  if (showCaller) {
    const fileName = path.basename(caller.getFileName());
    const lineNum = caller.getLineNumber();
    const colNum = caller.getColumnNumber();

    return `${fileName}:${lineNum}:${colNum}: ${payload}`;
  } else {
    return `${payload}`;
  }
}

export interface StackFrame {
  getTypeName(): string;
  getFunctionName(): string;
  getMethodName(): string;
  getFileName(): string;
  getLineNumber(): number;
  getColumnNumber(): number;
  isNative(): boolean;
}
