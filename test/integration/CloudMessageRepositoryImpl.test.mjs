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

import CloudMessageRepositoryImpl from '../../lib/interfaces/storage/CloudMessageRepositoryImpl.mjs';
import WaitingOrder from '../../lib/domain/entities/WaitingOrder.mjs';

describe('# Send push notification', () => {
  it('should work', async () => {
    const repo = new CloudMessageRepositoryImpl();

    const sent = await repo.sendOrderReadyMessage(new WaitingOrder({
      number: '9999',
      cafeteriaId: '1',
      deviceIdentifier: 'caa4-JIZS1-8C9d8npwQhH:APA91bFN_UjsyiKvyacO95KE5MwUbPPpm2tsuH_mK9UKR3aWbFDZKe7ZNgWXwjodpVbrDHrYpELILu93lod52Q7fHGBPPyJlcl7od7evjJ5SKBsEcXLjJYGnf7W78yJnA9Er9S6DpOV4',
    }));

    expect(sent).toBeTruthy();
  });
});
