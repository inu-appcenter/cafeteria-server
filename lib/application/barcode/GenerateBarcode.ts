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

import UseCase from '../../common/base/UseCase';
import {StudentId} from '../user/Types';
import assert from 'assert';

class GenerateBarcode extends UseCase<StudentId, string> {
  async onExecute({studentId}: StudentId): Promise<string> {
    const studentIdAsNumber = this.studentIdAsNumber(studentId);

    return this.multiplyConstant(studentIdAsNumber).toString();
  }

  private studentIdAsNumber(studentId: string) {
    assert(studentId.length >= 9, '학번은 9자리 이상!');
    assert(studentId.startsWith('20'), '학번은 20xx으로 시작해야 함!');

    const asNumber = Number.parseInt(studentId);

    assert(!isNaN(asNumber), '학번이 숫자여야 합니다!');

    return asNumber;
  }

  private multiplyConstant(studentIdAsNumber: number) {
    const digitsOfId = studentIdAsNumber.toString().length;

    switch (digitsOfId) {
      case 9: // 그냥보통학생
        return studentIdAsNumber * 6;
      case 10: // 한국어학당
        return studentIdAsNumber * 4;
      default:
        throw new Error('학번이 9자리도 10자리도 아니면 무엇입니까!');
    }
  }
}

export default new GenerateBarcode();
