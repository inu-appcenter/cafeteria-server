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

export function printInBox(
  title: string,
  message: string,
  border: string = '*',
  boxWidth: number = 64
) {
  const top =
    border.repeat(Math.floor((boxWidth - title.length - 2) / 2)) +
    ` ${title} ` +
    border.repeat(Math.ceil((boxWidth - title.length - 2) / 2));

  const middles = chunkString(message, boxWidth - 4).map(
    (line) => `${border} ` + line + ' '.repeat(boxWidth - 4 - line.length) + ` ${border}`
  );

  const bottom = border.repeat(boxWidth);

  console.log('\n' + top);
  console.log(middles.join('\n'));
  console.log(bottom + '\n');
}

function chunkString(str: string, length: number) {
  return str.match(new RegExp('.{1,' + length + '}', 'g')) || [];
}
