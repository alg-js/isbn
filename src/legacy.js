/* Copyright 2025 @alg/isbn contributors
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

/* @ts-self-types="./legacy.d.ts" */

import {
    hasValidIsbn10CheckDigit,
    hasValidIsbn13CheckDigit,
    isbn10CheckDigit, isbn13CheckDigit,
    matchIsbn10,
    matchIsbn13,
    parseIsbn10,
    parseIsbn13,
} from "./utils.js";

export class ISBN {
    static parse(string) {
        const {result, err} = this.parseResult(string);
        if (err !== undefined) {
            throw Error(err);
        } else {
            return result;
        }
    }

    static parseResult(string) {
        if (matchIsbn13(string)) {
            return parseIsbn13(string);
        } else {
            return parseIsbn10(string);
        }
    }

    static parseOrUndefined(string) {
        const {result, err} = this.parseResult(string);
        if (err !== undefined) {
            return undefined;
        } else {
            return result;
        }
    }

    static isValid(string) {
        return this.parseResult(string).result !== undefined;
    }
}

export function hasValidCheckDigit(string) {
    const digits13 = matchIsbn13(string);
    const digits10 = matchIsbn10(string);
    return (
        digits13 !== undefined && hasValidIsbn13CheckDigit(digits13)
        || digits10 !== undefined && hasValidIsbn10CheckDigit(digits10)
    );
}

export function checkDigit(digits) {
    if (digits.length === 9) {
        return isbn10CheckDigit(...digits);
    } else {
        return isbn13CheckDigit(...digits);
    }
}
