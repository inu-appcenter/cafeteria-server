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

import crypto from 'crypto';

export function encrypt(plain: string, secret: string) {
  const key = crypto.scryptSync(secret, 'yeah', 32);
  const iv = Buffer.alloc(16);

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  cipher.update(plain, 'utf-8', 'hex');

  return cipher.final('hex');
}

export function decrypt(encrypted: string, secret: string) {
  const key = crypto.scryptSync(secret, 'yeah', 32);
  const iv = Buffer.alloc(16);

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  decipher.update(encrypted, 'hex', 'utf-8');

  return decipher.final('utf-8');
}
