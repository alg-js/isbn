/* Copyright 2025 James Finnie-Ansley
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* @ts-self-types="./main.d.ts" */

const ISBN_13 = /^.*(?<!\d)(97[89]\d{10})$/;
const HYPHENATED_ISBN_13 = /^.*(?<!\d)((97[89])-(\d+)-(\d+)-(\d+)-(\d))$/;
const SPACED_ISBN_13 = /^.*(?<!\d)((97[89])\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d))$/;
const ISBN_A = /^.*10\.(97[89]\.[\d.]+\/\d+)$/;


export function isValid(string) {
    return toDigits(string) !== null;
}

export function toDigits(string) {
    let match;
    let digits;
    if ((match = ISBN_13.exec(string)) !== null) {
        digits = match[1];
    } else if ((match = HYPHENATED_ISBN_13.exec(string)) !== null) {
        digits = match[1].replaceAll("-", "");
    } else if ((match = SPACED_ISBN_13.exec(string)) !== null) {
        digits = match[1].replaceAll(" ", "");
    } else if ((match = ISBN_A.exec(string)) !== null) {
        digits = match[1].replaceAll(/[./]/g, "");
    }

    if (digits !== undefined && digits.length === 13 && checkDigits(digits)) {
        return digits;
    } else {
        return null;
    }
}

function checkDigits(digits) {
    digits = [...digits].map(e => Number(e));
    const checkSum = digits
        .slice(0, -1)
        .reduce((a, e, i) => a + (i % 2 === 0 ? 1 : 3) * e);
    const checkDigit = 10 - checkSum % 10;
    return checkDigit === digits.at(-1);
}
