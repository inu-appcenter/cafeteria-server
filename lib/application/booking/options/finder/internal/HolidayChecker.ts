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

import config from '../../../../../../config';
import ical, {VEvent} from 'node-ical';
import {isSameDay} from 'date-fns';
import {logger} from '@inu-cafeteria/backend-core';
import assert from 'assert';

class HolidayChecker {
  static instance = new HolidayChecker();

  protected holidays?: VEvent[] = undefined;

  private constructor() {
    this.fetchIfNeeded();
  }

  async fetchIfNeeded() {
    if (this.isFetchNeeded()) {
      await this.fetchEvents();
    }

    if (this.isFetchNeeded()) {
      logger.warn('공휴일 이벤트를 가져와도 아무 것도 없습니다. 일단 빈 배열로 설정합니다.');

      this.holidays = [];
    }
  }

  private isFetchNeeded() {
    return this.holidays == null;
  }

  private async fetchEvents() {
    logger.info('휴일 캘린더 이벤트를 모두 가져옵니다.');

    const response = await ical.async.fromURL(config.external.calender.holidays.url);
    const values = Object.values(response);

    this.holidays = values
      .filter((something) => something.type === 'VEVENT')
      .map((event) => event as VEvent);

    logger.info(`휴일 캘린더 이벤트를 ${this.holidays.length}개 가져왔습니다.`);
  }

  /**
   * 오늘이 휴일인지 알아냅니다.
   *
   * @param today 기준이 되는 오늘 날짜.
   */
  isHoliday(today: Date = new Date()): boolean {
    assert(this.holidays, 'fetchIfNeeded 먼저 실행해주세요!');

    const events = this.holidays!;

    const holiday = events.find((event) => isSameDay(today, event.start));

    return holiday != null;
  }
}

const holidayChecker = HolidayChecker.instance;

export default holidayChecker;
