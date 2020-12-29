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

import CoopRepositoryImpl from '../../../../lib/interfaces/storage/CoopRepositoryImpl';
import config from '../../../../config';
import moment from 'moment';

describe('# visit coop', () => {
  it('should succeed', async () => {
    const repo = new CoopRepositoryImpl();

    const response = await repo.visit({
      url: config.menu.url,
    });

    expect(response.includes('자동등록방지를 위해 보안절차를 거치고 있습니다.')).toBe(false);
  }, 10000);
});

describe('# get week diff', () => {
  it('finding 1', async () => {
    const today = moment('20201206' /* Sun */, 'YYYYMMDD').toDate();
    const theDay = moment('20201206' /* Sun */, 'YYYYMMDD').toDate();

    const diff = new CoopRepositoryImpl().getWeekDiff(theDay, today);

    expect(diff).toBe(-1);
  });

  it('finding 2', async () => {
    const today = moment('20201206' /* Sun */, 'YYYYMMDD').toDate();
    const theDay = moment('20201205' /* Sat */, 'YYYYMMDD').toDate();

    const diff = new CoopRepositoryImpl().getWeekDiff(theDay, today);

    expect(diff).toBe(-1);
  });

  it('finding 3', async () => {
    const today = moment('20201206' /* Sun */, 'YYYYMMDD').toDate();
    const theDay = moment('20201130' /* Mon */, 'YYYYMMDD').toDate();

    const diff = new CoopRepositoryImpl().getWeekDiff(theDay, today);

    expect(diff).toBe(-1);
  });

  it('finding 4', async () => {
    const today = moment('20201206' /* Sun */, 'YYYYMMDD').toDate();
    const theDay = moment('20201207' /* Mon */, 'YYYYMMDD').toDate();

    const diff = new CoopRepositoryImpl().getWeekDiff(theDay, today);

    expect(diff).toBe(0);
  });

  it('finding 5', async () => {
    const today = moment('20201206' /* Sun */, 'YYYYMMDD').toDate();
    const theDay = moment('20201209' /* Wed */, 'YYYYMMDD').toDate();

    const diff = new CoopRepositoryImpl().getWeekDiff(theDay, today);

    expect(diff).toBe(0);
  });

  it('finding 6', async () => {
    const today = moment('20201206' /* Sun */, 'YYYYMMDD').toDate();
    const theDay = moment('20201212' /* Sat */, 'YYYYMMDD').toDate();

    const diff = new CoopRepositoryImpl().getWeekDiff(theDay, today);

    expect(diff).toBe(0);
  });

  it('finding 6', async () => {
    const today = moment('20201206' /* Sun */, 'YYYYMMDD').toDate();
    const theDay = moment('20201213' /* Sun */, 'YYYYMMDD').toDate();

    const diff = new CoopRepositoryImpl().getWeekDiff(theDay, today);

    expect(diff).toBe(0);
  });

  it('finding 7', async () => {
    const today = moment('20201230' /* Wed */, 'YYYYMMDD').toDate();
    const theDay = moment('20201230' /* Wed */, 'YYYYMMDD').toDate();

    const diff = new CoopRepositoryImpl().getWeekDiff(theDay, today);

    expect(diff).toBe(0);
  });

  it('finding 8', async () => {
    const today = moment('20201230' /* Wed */, 'YYYYMMDD').toDate();
    const theDay = moment('20201231' /* Thur */, 'YYYYMMDD').toDate();

    const diff = new CoopRepositoryImpl().getWeekDiff(theDay, today);

    expect(diff).toBe(0);
  });

  it('finding 9', async () => {
    const today = moment('20201230' /* Wed */, 'YYYYMMDD').toDate();
    const theDay = moment('20210101' /* Fri */, 'YYYYMMDD').toDate();

    const diff = new CoopRepositoryImpl().getWeekDiff(theDay, today);

    expect(diff).toBe(0);
  });

  it('finding 10', async () => {
    const today = moment('20201230' /* Wed */, 'YYYYMMDD').toDate();
    const theDay = moment('20210102' /* Sat */, 'YYYYMMDD').toDate();

    const diff = new CoopRepositoryImpl().getWeekDiff(theDay, today);

    expect(diff).toBe(0);
  });

  it('finding 11', async () => {
    const today = moment('20201230' /* Wed */, 'YYYYMMDD').toDate();
    const theDay = moment('20210103' /* Sun */, 'YYYYMMDD').toDate();

    const diff = new CoopRepositoryImpl().getWeekDiff(theDay, today);

    expect(diff).toBe(0);
  });

  it('finding 12', async () => {
    const today = moment('20201230' /* Wed */, 'YYYYMMDD').toDate();
    const theDay = moment('20210104' /* Mon */, 'YYYYMMDD').toDate();

    const diff = new CoopRepositoryImpl().getWeekDiff(theDay, today);

    expect(diff).toBe(1);
  });
});

