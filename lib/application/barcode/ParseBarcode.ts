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
import assert from 'assert';
import {StudentId} from '../user/base/Types';

class ParseBarcode extends UseCase<string, StudentId> {
  async onExecute(barcode: string): Promise<StudentId> {
    const barcodeAsNumber = this.barcodeAsNumber(barcode);

    return {
      studentId: this.divideByConstant(barcodeAsNumber).toString(),
    };
  }

  private barcodeAsNumber(barcode: string) {
    const asNumber = Number.parseInt(barcode);

    assert(!isNaN(asNumber));

    return asNumber;
  }

  private divideByConstant(barcodeAsNumber: number) {
    const digitsOfId = barcodeAsNumber < 2 * 10 ** 9 ? 9 : 10;

    switch (digitsOfId) {
      case 9:
        return barcodeAsNumber / 6;
      case 10:
        return barcodeAsNumber / 4;
      default:
        throw new Error('바코드가 9자리도 10자리도 아니면 무엇입니까!');
    }
  }
}

export default new ParseBarcode();
