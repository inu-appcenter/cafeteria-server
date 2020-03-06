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

'use strict';

const crypto = require('crypto');

export default (raw, key) => {
  // *WARNING*
  // createCipher() is deprecated.
  // It creates a cipher without initial vector.
  // It is potentially danger to use only (key) for encryption,
  // We are recommended to use createCipher() so we use (key, iv) pair
  // as an encryption key.
  //
  // Sadly the login server requires a password encrypted with
  // only a single key.
  // We need a secure communication between the login server and this one.
  // In current configuration, once the key is leaked,
  // every private information will be visible, crystal-clearly.
  const cipher = crypto.createCipher('aes-256-cbc', key);
  cipher.update(raw, 'utf-8', 'base64');

  return cipher.final('base64');
};
