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

/* @ts-self-types="./iso2108.2005.d.ts" */

import {
    isbn10CheckDigit, isbn13CheckDigit, matchIsbn13, parseIsbn10, parseIsbn13,
} from "./utils.js";
import rangeInfo from "./range.json" with {type: "json"};


export default class ISBN {
    constructor(gs1, group, registrant, publication, checkDigit) {
        Object.defineProperty(this, "gs1", {value: gs1});
        Object.defineProperty(this, "group", {value: group});
        Object.defineProperty(this, "registrant", {value: registrant});
        Object.defineProperty(this, "publication", {value: publication});
        Object.defineProperty(this, "checkDigit", {value: checkDigit});
    }

    static #fromIsbn13(gs1, group, registrant, publication, checkDigit) {
        return new ISBN(gs1, group, registrant, publication, checkDigit);
    }

    static #fromIsbn10(group, registrant, publication, _) {
        const checkDigit = isbn13CheckDigit(
            ..."978", ...group, ...registrant, ...publication,
        );
        return new ISBN("978", group, registrant, publication, checkDigit);
    }

    static parseOrThrow(string) {
        const {result, err} = this.parseResult(string);
        if (err !== undefined) {
            throw Error(err);
        } else {
            return result;
        }
    }

    static #parseIsbn13Result(string) {
        const {result, err} = parseIsbn13(string);
        if (err === undefined) {
            return {result: ISBN.#fromIsbn13(...result)};
        } else {
            return {err: err};
        }
    }

    static #parseIsbn10Result(string) {
        const {result, err} = parseIsbn10(string);
        if (err === undefined) {
            return {result: ISBN.#fromIsbn10(...result)};
        } else {
            return {err: err};
        }
    }

    static parseResult(string) {
        if (matchIsbn13(string)) {
            return this.#parseIsbn13Result(string);
        } else {
            return this.#parseIsbn10Result(string);
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

    components({format = "ISBN"} = {}) {
        const common = [this.group, this.registrant, this.publication];
        if (format === "ISBN-13" || format === "ISBN") {
            return [this.gs1, ...common, this.checkDigit];
        } else if (format === "ISBN-10") {
            // TODO - This is technically incorrect if the GS1 element is any
            //  value other than 978
            return [...common, isbn10CheckDigit(...common.join(""))];
        } else {
            throw Error(
                `Unrecognised ISO 2108:2005 format: \`${format}\`. `
                + `Should be \`ISBN-13\` or \`ISBN-10\``,
            );
        }
    }

    get agency() {
        return rangeInfo[this.gs1][this.group]["agency"];
    }

    digits({format = "ISBN"} = {}) {
        return this.components({format: format}).join("");
    }

    toString({format = "ISBN"} = {}) {
        return `${format} ${this.components({format: format}).join("-")}`;
    }

    get [Symbol.toStringTag]() {
        return this.components().join("-");
    }
}
