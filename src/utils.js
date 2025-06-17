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

import rangeInfo from "./range.json" with {type: "json"};
import {ISBN} from "./main.js";
import {ISBN_10, ISBN_13} from "./format_spec.js";


export function parseIsbn13(string) {
    const digits = matchIsbn13(string);
    if (digits === undefined) {
        return {err: "Invalid ISBN format"};
    } else if (!hasValidIsbn13CheckDigit(digits)) {
        return {err: "Invalid ISBN Check Digit"};
    }

    let [prefix, rest] = [digits.slice(0, 3), digits.slice(3)];
    const groups = rangeInfo[prefix];
    if (groups === undefined) {
        return {err: "Invalid ISBN GS1 prefix"};
    }
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

export function parseIsbn10(string) {
    const digits = matchIsbn10(string);
    if (digits === undefined) {
        return {err: "Invalid ISBN format"};
    } else if (!hasValidIsbn10CheckDigit(digits)) {
        return {err: "Invalid ISBN Check Digit"};
    }
    const groups = rangeInfo["978"];
    const group = Object.keys(groups).find(k => digits.startsWith(k));
    if (group === undefined) {
        return {err: "Unrecognised ISBN group element"};
    }
    const rest = digits.slice(group.length);
    const rules = groups[group]["rules"];
    const registrant = findRegistrant(rest, rules);
    if (registrant === undefined) {
        return {err: "Unrecognised ISBN registrant element"};
    }
    const publication = rest.slice(registrant.length, -1);
    return {
        result: new ISBN(
            "978",
            group,
            registrant,
            publication,
            isbn13CheckDigit(..."978", ...group, ...registrant, ...publication),
        ),
    };
}

export function matchIsbn13(string) {
    const digits = ISBN_13.exec(string)
        ?.groups
        ?.digits
        ?.replaceAll?.(/[\-\s./]/g, "");
    if (string.includes("\n") || digits === undefined || digits.length !== 13) {
        return undefined;
    } else {
        return digits;
    }
}


export function matchIsbn10(string) {
    const digits = ISBN_10.exec(string)
        ?.groups
        ?.digits
        ?.replaceAll?.(/[\-\s./]/g, "")
        ?.toUpperCase?.();
    if (string.includes("\n") || digits === undefined || digits.length !== 10) {
        return undefined;
    } else {
        return digits;
    }
}


export function hasValidIsbn13CheckDigit(digits) {
    return isbn13CheckDigit(...digits.slice(0, -1)) === digits.at(-1);
}

export function hasValidIsbn10CheckDigit(digits) {
    return isbn10CheckDigit(...digits.slice(0, -1)) === digits.at(-1);
}

function findRegistrant(rest, rules) {
    for (let i = 0; i < rules.length; i += 3) {
        const length = rules[i];
        const restNum = Number(rest.slice(0, length));
        const lo = rules[i + 1];
        const hi = rules[i + 2];
        if (lo <= restNum && restNum <= hi) {
            return rest.slice(0, length);
        }
    }
    return undefined;
}

export function isbn13CheckDigit(...args) {
    if (args.length === 12) {
        const checkSum = args
            .map(e => Number(e))
            .reduce((a, e, i) => a + (i % 2 === 0 ? 1 : 3) * e);
        return (10 - checkSum % 10).toString();
    } else {
        return undefined;
    }
}

export function isbn10CheckDigit(...args) {
    if (args.length === 9) {
        const checkSum = args
            .map(e => Number(e))
            .reduce((a, e, i) => a + (10 - i) * e);
        const checkDigit = (11 - checkSum % 11) % 11
        return checkDigit === 10 ? "X" : checkDigit.toString();
    } else {
        return undefined;
    }
}
