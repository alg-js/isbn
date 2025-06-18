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

/* @ts-self-types="./iso2108.2017.d.ts" */

import {parseIsbn13} from "./utils.js";
import rangeInfo from "./range.json" with {type: "json"};


export default class ISBN {
    constructor(gs1, group, registrant, publication, checkDigit) {
        Object.defineProperty(this, "gs1", {value: gs1});
        Object.defineProperty(this, "group", {value: group});
        Object.defineProperty(this, "registrant", {value: registrant});
        Object.defineProperty(this, "publication", {value: publication});
        Object.defineProperty(this, "checkDigit", {value: checkDigit});
    }

    static parse(string) {
        const {result, err} = this.parseResult(string);
        if (err !== undefined) {
            throw Error(err);
        } else {
            return result;
        }
    }

    static parseResult(string) {
        const {result, err} = parseIsbn13(string);
        if (err === undefined) {
            return {result: new ISBN(...result)};
        } else {
            return {err: err};
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

    components({} = {}) {
        return [
            this.gs1,
            this.group,
            this.registrant,
            this.publication,
            this.checkDigit,
        ];
    }

    get agency() {
        return rangeInfo[this.gs1][this.group]["agency"];
    }

    digits({} = {}) {
        return this.components().join("");
    }

    toString({} = {}) {
        return `ISBN ${this.components().join("-")}`;
    }

    get [Symbol.toStringTag]() {
        return this.components().join("-");
    }
}
