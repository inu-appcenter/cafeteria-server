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

/**
 * These are most latest in November 2020.
 */
export default {

  cafeteria: [
    {
      id: 1,
      name: '학생식당',
      display_name: '학생 식당',
      image_path: '',
      support_menu: true,
      support_discount: false,
      support_notification: false,
    },
    {
      id: 2,
      name: '27호관식당',
      display_name: '27호관 식당',
      image_path: '',
      support_menu: true,
      support_discount: false,
      support_notification: false,
    },
    {
      id: 3,
      name: '사범대식당',
      display_name: '사범대 식당',
      image_path: '',
      support_menu: true,
      support_discount: true,
      support_notification: false,
    },
    {
      id: 4,
      name: '제1기숙사식당',
      display_name: '제1기숙사 식당',
      image_path: '',
      support_menu: true,
      support_discount: true,
      support_notification: false,
    },
    {
      id: 5,
      name: '2호관식당',
      display_name: '2호관 식당',
      image_path: '',
      support_menu: true,
      support_discount: false,
      support_notification: false,
    },
  ],

  corners: [
    // 학생식당
    {id: 1, name: '1코너중식(앞쪽)', display_name: '1코너', available_at: 2, cafeteria_id: 1},
    {id: 2, name: '1-1코너중식(앞쪽)', display_name: '1-1코너', available_at: 4, cafeteria_id: 1},
    {id: 3, name: '2-1코너 중식(앞쪽)', display_name: '2-1코너', available_at: 2, cafeteria_id: 1},
    {id: 4, name: '2-1코너 석식(앞쪽)', display_name: '2-1코너', available_at: 4, cafeteria_id: 1},
    {id: 5, name: '2-2코너 중식(앞쪽)', display_name: '2-2코너', available_at: 2, cafeteria_id: 1},
    {id: 6, name: '3코너(앞쪽)', display_name: '3코너', available_at: 2|4, cafeteria_id: 1},
    {id: 7, name: '4코너(뒤쪽)', display_name: '3코너', available_at: 2|4, cafeteria_id: 1},
    {id: 8, name: '5코너(뒤쪽)', display_name: '3코너', available_at: 2|4, cafeteria_id: 1},

    // 27호관식당
    {id: 9, name: 'A코너 중식', display_name: 'A코너', available_at: 2, cafeteria_id: 2},
    {id: 10, name: 'A코너 석식', display_name: 'A코너', available_at: 4, cafeteria_id: 2},
    {id: 11, name: 'B코너 중식', display_name: 'B코너', available_at: 2, cafeteria_id: 2},

    // 사범대식당
    {id: 12, name: '중식', display_name: '', available_at: 2, cafeteria_id: 3},
    {id: 13, name: '석식', display_name: '', available_at: 4, cafeteria_id: 3},

    // 제1기숙사식당
    {id: 14, name: '조식', display_name: '', available_at: 1, cafeteria_id: 4},
    {id: 15, name: '중식', display_name: '', available_at: 2, cafeteria_id: 4},
    {id: 16, name: '석식', display_name: '', available_at: 4, cafeteria_id: 4},

    // 2호관식당
    {id: 17, name: '중식', display_name: '', available_at: 2, cafeteria_id: 5},
    {id: 18, name: '석식', display_name: '', available_at: 4, cafeteria_id: 5},
  ],

  validationParams: [
    {
      cafeteria_id: 3, /* 사범대 */
      token: '$2b$09$im4EsvdDUMEP00/MqJ0fOe2hgCufZbHjwPr51nyVTK3KfjWXse9HW', // bcrypt hashed
      available_meal_types: 2 | 4, /* launch and dinner only */
      time_range_breakfast: '08:30-11:00',
      time_range_lunch: '10:20-14:10',
      time_range_dinner: '16:30-23:40',
    },
    {
      cafeteria_id: 4, /* 제1기숙사식당 */
      token: '$2b$09$7gXIej4V7ZAu8fPSDiEVVOBOKiLEBKJkumHONkIECver4EW829pZ2', // bcrypt hashed
      available_meal_types: 1, /* breakfast only */
      time_range_breakfast: '08:30-11:00',
      time_range_lunch: '10:20-14:10',
      time_range_dinner: '16:30-23:40',
    },
  ],

  ruleStatuses: [
    {
      id: 1,
      enabled: true,
    },
    {
      id: 2,
      enabled: true,
    },
    {
      id: 3,
      enabled: true,
    },
    {
      id: 4,
      enabled: true,
    },
    {
      id: 5,
      enabled: true,
    },
    {
      id: 6,
      enabled: true,
    },
    {
      id: 7,
      enabled: true,
    },
  ],
};
