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

import {defineSchema} from '../../libs/schema';
import {defineRoute} from '../../libs/route';
import {z} from 'zod';
import {stringAsInt} from '../../utils/zodTypes';
import VerifyDiscountTransaction from '../../../../application/discount/VerifyDiscountTransaction';
import {logger} from '@inu-cafeteria/backend-core';
import {stringifyError} from '../../../../common/utils/error';

const schema = defineSchema({
  query: {
    barcode: z.string(),
    code: stringAsInt,
    menu: z.string(),
  },
});

const cafeCodeToCafeteriaId: Record<number, number> = {
  /* Cafe code : Newly given cafeteria id */
  1: 4 /* 제1 기숙사식당 */,
  2: 3 /* 사범대식당 */,
};

/**
 * 레거시 라우트입니다.
 * 곧 삭제될 예정입니다.
 */
export default defineRoute('get', '/isBarcode', schema, async (req, res) => {
  const {barcode, code} = req.query;

  const cafeteriaId = cafeCodeToCafeteriaId[code];

  try {
    await VerifyDiscountTransaction.run({barcode, cafeteriaId});
  } catch (e) {
    logger.error(`레거시 라우트 isBarcode 에서 생긴 에러: ${stringifyError(e)}`);
    logger.info(
      `에러가 생겼지만 레거시 클라이언트는 아직 200 이외의 응답을 잘 모르기 때문에 200을 내려보내줍니다.`
    );

    return res.json({
      message: 'SUCCESS',
      activated: 0,
    });
  }

  return res.json({
    message: 'SUCCESS',
    activated: 1,
  });
});
