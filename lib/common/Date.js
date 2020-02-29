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

const moment = require('moment');

Date.prototype.yyyymmdd = function(dash=false) {
	const mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
	const dd = this.getDate().toString();

	return [
		this.getFullYear(),
		dash ? '-' : '',
		(mm.length === 2) ? '' : '0',
		mm,
		dash ? '-' : '',
		(dd.length === 2) ? '' : '0',
		dd
	].join(''); // padding
};

Date.prototype.isBetween = function(timeRanges, graceMinutes=0) {
	const thisMoment = moment(this);

	for (var i = 0; i < timeRanges.length; i++) {
		const inRange = thisMoment.isBetween(
			timeRanges[i].start.subtract(graceMinutes, 'minutes'),
			timeRanges[i].end.add(graceMinutes, 'minutes'),
			'minute'/* minute granularity */,
			'[]'/* include start and end. */
		);

		if (inRange) {
			return i;
		}
	}

	return -1;
};
