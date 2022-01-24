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

import {defineSchema} from '../../libs/schema';
import {defineRoute} from '../../libs/route';
import {stringAsInt} from '../../utils/zodTypes';
import MarkAnswerRead from '../../../../application/qna/MarkAnswerRead';

const schema = defineSchema({
  params: {
    answerId: stringAsInt,
  },
});

export default defineRoute('post', '/markAnswerRead/:answerId', schema, async (req, res) => {
  const {answerId} = req.params;

  await MarkAnswerRead.run({answerId});

  res.send();
});
