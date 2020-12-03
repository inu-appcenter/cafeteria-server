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

import EmailRepositoryImpl from '../../lib/interfaces/storage/EmailRepositoryImpl';
import EmailParams from '../../lib/domain/entities/EmailParams';
import config from '../../config';

describe('# Send email', () => {
  it('should work', async () => {
    const repo = new EmailRepositoryImpl();

    // You need to set SMTP_USERNAME and SMTP_PASSWORD in env.
    await repo.sendEmail(new EmailParams({
      from: config.mail.sender,
      to: config.mail.addresses.admin,
      title: '안녕하세요!',
      body: '작동해요!!!!!!!!!!!',
    }));
  });
});
