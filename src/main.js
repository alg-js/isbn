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

/* @ts-self-types="./main.d.ts" */

import rangeInfo from "./range.json" with {type: "json"};


const ISBN_13 = /^.*(?<!\d)(97[89]\d{10})$/;
const HYPHENATED_ISBN_13 = /^.*(?<!\d)((97[89])-(\d+)-(\d+)-(\d+)-(\d))$/;
const SPACED_ISBN_13 = /^.*(?<!\d)((97[89])\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d))$/;
const ISBN_A = /^.*10\.(97[89]\.[\d.]+\/\d+)$/;


export class ISBN {
    constructor(gs1, group, registrant, publication, checkDigit) {
        Object.defineProperty(this, "gs1", {value: gs1});
        Object.defineProperty(this, "group", {value: group});
        Object.defineProperty(this, "registrant", {value: registrant});
        Object.defineProperty(this, "publication", {value: publication});
        Object.defineProperty(this, "checkDigit", {value: checkDigit});
    }

    static parse(string) {
        const {result, err} = ISBN.parseResult(string);
        if (err !== undefined) {
            throw Error(err);
        } else {
            return result;
        }
    }

    static parseResult(string) {
        const digits = rawDigits(string);
        if (digits === undefined) {
            return {err: "Invalid ISBN format"};
        }
        if (!checkDigits(digits)) {
            return {err: "Invalid ISBN Check Digit"};
        }

        let [prefix, rest] = [digits.slice(0, 3), digits.slice(3)];
        const groups = rangeInfo[prefix];
        // This is handled by the REGEX - but this might change an will need to
        // be handled here
        // if (groups === undefined) {
        //     return {err: "Invalid ISBN GS1 prefix"};
        // }
        const group = Object.keys(groups).find(k => rest.startsWith(k));
        if (group === undefined) {
            return {err: "Unrecognised ISBN group element"};
        }
        rest = rest.slice(group.length);
        const rules = groups[group]["rules"];
        const registrant = findRegistrant(rest, rules);
        if (registrant === undefined) {
            return {err: "Unrecognised ISBN registrant element"};
        }
        const publication = rest.slice(registrant.length, -1);
        const checkDigit = rest.at(-1);
        return {
            result: new ISBN(
                prefix,
                group,
                registrant,
                publication,
                checkDigit,
            ),
        };
    }

    static parseOrUndefined(string) {
        const {result, err} = ISBN.parseResult(string);
        if (err !== undefined) {
            return undefined;
        } else {
            return result;
        }
    }

    components() {
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

    get digits() {
        return this.components().join("");
    }

    asNumber() {
        return Number.parseInt(this.digits);
    }

    toString() {
        return `ISBN ${this[Symbol.toStringTag]}`;
    }

    get [Symbol.toStringTag]() {
        return this.components().join("-");
    }
}

export function validateChecksum(string) {
    const digits = rawDigits(string);
    return digits !== undefined && checkDigits(digits);
}

function rawDigits(string) {
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

    if (digits === undefined || digits.length !== 13) {
        return undefined;
    } else {
        return digits;
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

function findRegistrant(rest, rules) {
    for (let i = 0; i < rules.length; i += 3) {
        const length = rules[i];
        const restNum = Number.parseInt(rest.slice(0, length));
        const lo = rules[i + 1];
        const hi = rules[i + 2];
        if (lo <= restNum && restNum <= hi) {
            return rest.slice(0, length);
        }
    }
    return undefined;
}
