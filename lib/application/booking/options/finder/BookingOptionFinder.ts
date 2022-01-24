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

import BookingOptionBuilder from './internal/BookingOptionBuilder';
import {BookingOption, CafeteriaBookingParams} from '@inu-cafeteria/backend-core';

/**
 * 예약 옵션을 찾아와 주는 친구입니다.
 *
 * 캐싱을 지원합니다!!
 * 같은 인스턴스에서는 두 번 이상 계산하지 않습니다.
 */
export default class BookingOptionFinder {
  private allBookingParams?: CafeteriaBookingParams[] = undefined;
  private bookingOptions = new Map<CafeteriaBookingParams, BookingOption[]>();

  /**
   * 모든 식당에 대해 사용자에게 보여 줄 예약 옵션을 가져옵니다.
   */
  async findAll(): Promise<BookingOption[]> {
    const allBookingParams = await this.getAllBookingParams();

    const allOptions = await Promise.all(
      allBookingParams.map((params) => this.findByBookingParams(params))
    );

    return allOptions.flat();
  }

  private async getAllBookingParams(): Promise<CafeteriaBookingParams[]> {
    const fromCache = this.allBookingParams;

    if (fromCache == null) {
      const result = await CafeteriaBookingParams.findAll();
      this.allBookingParams = result;

      return result;
    } else {
      return fromCache;
    }
  }

  /**
   * 어떠한 식당에 대해 사용자에게 보여 줄 예약 옵션을 가져옵니다.
   *
   * @param cafeteriaId 식당 식별자.
   */
  async findByCafeteriaId(cafeteriaId: number): Promise<BookingOption[]> {
    const params = await this.getBookingParams(cafeteriaId);
    if (params == null) {
      return [];
    }

    return await this.findByBookingParams(params);
  }

  private async getBookingParams(cafeteriaId: number): Promise<CafeteriaBookingParams | undefined> {
    const all = await this.getAllBookingParams();

    return all.find((params) => params.cafeteriaId === cafeteriaId);
  }

  /**
   * 예약 옵션을 가져오는 메소드는 결국 여기로 모입니다.
   *
   * @param params 예약 파라미터.
   */
  async findByBookingParams(params: CafeteriaBookingParams): Promise<BookingOption[]> {
    const fromCache = this.bookingOptions.get(params);

    if (fromCache == null) {
      const result = await new BookingOptionBuilder(params).buildAll();
      this.bookingOptions.set(params, result);

      return result;
    } else {
      return fromCache;
    }
  }

  /**
   * 식당 식별자와 타임슬롯으로 예약 옵션을 하나 가져옵니다.
   * 예약 요청을 받아서 해당 옵션을 역으로 도출할 때에 사용합니다.
   *
   * @param cafeteriaId 식당 식별자.
   * @param timeSlotStart 타임슬롯 시작.
   */
  async findByCafeteriaIdAndTimeSlotStart(
    cafeteriaId: number,
    timeSlotStart: Date
  ): Promise<BookingOption | undefined> {
    const options = await this.findByCafeteriaId(cafeteriaId);

    return options.find((o) => o.timeSlotStart.getTime() === timeSlotStart.getTime());
  }
}
