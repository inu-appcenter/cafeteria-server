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

/******************************WARNING******************************
 * This router contains old APIs which are vulnerable and unsafe.
 * Those are still (Feb 2020) used by UICOOP POS system,
 * so they cannot be changed or upgraded easilly.
 *******************************************************************/

/**
 * A Deep Dive into The Old API Implemenation.
 *
 * This description is based on commits in 2018, 2019 of this repository
 * (https://github.com/inu-appcenter/cafeteria-server).
 *
 * SYNOPSIS:
 * This server serves for both client (students) and UICOOP.
 *
 * DESCRIPTION:
 * Once a user opens an app and enable [his|her] barcode,
 * this erver writes the status change to its DB.
 * Now the server is ready to get a request from UICOOP.
 *
 * The user then tags the barcode to the POS machine of a cafeteria.
 * The machine makes use of two APIs: /isBarcode, and /paymentSend.
 *
 * The former is called right after the user tags the barcode.
 * It check these conditions:
 *
 * (in time where discount is available) && (barcode activated) &&
 * (has not received discount in the same day) &&
 * (last barcode tag more than 15 secs ago)
 *
 * The latter is called after the whole payment process is done.
 * It also check these conditions:
 *
 * (it should say 'Y', which means confirm the discount) &&
 * (no dups in transaction table)
 *
 * SUMMARY:
 * - /isBarcode: check if a discount is available for the user.
 * - /paymentSend: confirm or cancel the discount.
 */

 module.exports = {
 	name: 'transaction',
 	version: '0.1.0',
 	register: async (server) => {

 		server.route([
			// TODO implement
 		]);
 	}
 };
