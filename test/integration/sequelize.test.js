/**
 * This file is part of INU Cafeteria.
 *
 * Copyright (C) 2020 INU Appcenter <potados99@gmail.com>
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

'use strict';

import sequelize from '../../lib/infrastructure/database/sequelize';

describe('# Sequelize', () => {
  it('should sync', async () => {
    await sequelize.sync();
  });

  it('should add rows', async () => {
    const cafeteriaModel = sequelize.model('cafeteria');
    const cornerModel = sequelize.model('corner');
    const cafeteriaDiscountRuleModel = sequelize.model('cafeteria_discount_rule');

    await cafeteriaModel.bulkCreate([
      {id: 1, name: '복지회관 학생식당', image_path: 'res/images/cafeteria-1.jpg'},
      {id: 2, name: '카페테리아', image_path: 'res/images/cafeteria-2.jpg'},
      {id: 3, name: '사범대식당', image_path: 'res/images/cafeteria-3.jpg'},
      {id: 4, name: '생활관 기숙사식당', image_path: 'res/images/cafeteria-4.jpg'},
      {id: 5, name: '교직원식당', image_path: 'res/images/cafeteria-5.jpg'},
    ]);

    await cornerModel.bulkCreate([
      {id: 1, name: '1코너 점심', cafeteria_id: 1},
      {id: 2, name: '1코너 저녁', cafeteria_id: 1},
      {id: 3, name: '2-1코너 점심', cafeteria_id: 1},
      {id: 4, name: '2-2코너 저녁', cafeteria_id: 1},
      {id: 5, name: '2-2코너 점심', cafeteria_id: 1},
      {id: 6, name: '3코너', cafeteria_id: 1},
      {id: 7, name: '4코너', cafeteria_id: 1},
      {id: 8, name: '5코너', cafeteria_id: 1},

      {id: 9, name: '점심', cafeteria_id: 2},
      {id: 10, name: 'A코너(저녁)', cafeteria_id: 2},
      {id: 11, name: 'B코너', cafeteria_id: 2},

      {id: 12, name: '점심', cafeteria_id: 3},
      {id: 13, name: '저녁', cafeteria_id: 3},

      {id: 14, name: '아침', cafeteria_id: 4},
      {id: 15, name: '점심', cafeteria_id: 4},
      {id: 16, name: '저녁', cafeteria_id: 4},

      {id: 17, name: '점심', cafeteria_id: 5},
      {id: 18, name: '저녁', cafeteria_id: 5},
    ]);

    await cafeteriaDiscountRuleModel.bulkCreate([
      {
        token: '$2b$09$7gXIej4V7ZAu8fPSDiEVVOBOKiLEBKJkumHONkIECver4EW829pZ2',
        available_meal_types: 2**0, /* breakfast only */
        cafeteria_id: 4, /* 생활원 기숙사식당 */
      },
      {
        token: '$2b$09$im4EsvdDUMEP00/MqJ0fOe2hgCufZbHjwPr51nyVTK3KfjWXse9HW',
        available_meal_types: 2**1 | 2**2, /* launch and dinner only */
        cafeteria_id: 3, /* 사범대 */
      },
    ]);
  });

  it('should close', async () => {
    await sequelize.close();
  });
});
