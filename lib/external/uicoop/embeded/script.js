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

/* eslint-disable */

var slowAES = require('./slowAES');

function toNumbers(t) {
  var e = [];
  return (
    t.replace(/(..)/g, function (t) {
      e.push(parseInt(t, 16));
    }),
    e
  );
}

function toHex() {
  for (
    var t = [],
      t = 1 == arguments.length && arguments[0].constructor == Array ? arguments[0] : arguments,
      e = '',
      o = 0;
    o < t.length;
    o++
  )
    e += (16 > t[o] ? '0' : '') + t[o].toString(16);
  return e.toLowerCase();
}

function getUrlParams() {
  var t = {};
  return (
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (e, o, r) {
      t[o] = r;
    }),
    t
  );
}

function getCupidCookie(strA, strB, strC) {
  var a = toNumbers(strA),
    b = toNumbers(strB),
    c = toNumbers(strC);

  return 'CUPID=' + toHex(slowAES.decrypt(c, 2, a, b)) + '; path=/';
}

module.exports = getCupidCookie;
