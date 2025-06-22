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

import {parse} from "jsr:@libs/xml@7";
import * as path from "jsr:@std/path";

function parseRule(rule) {
    const length = Number.parseInt(rule["Length"]);
    if (length === 0) {
        return null;
    } else {
        const [left, right] = rule["Range"].split("-");
        return [
            length,
            Number.parseInt(left.slice(0, length)),
            Number.parseInt(right.slice(0, length)),
        ];
    }
}

function parseRules(rules) {
    if (!(rules instanceof Array)) {
        rules = [rules];
    }
    return rules
        .map((r) => parseRule(r))
        .filter((r) => r !== null)
        .flat();
}

const xmlPath = path.resolve(import.meta.dirname, "RangeMessage.xml");
const data = await Deno.readTextFile(xmlPath);
const rangeData =
    parse(data)
        ["ISBNRangeMessage"]
        ["RegistrationGroups"]
        ["Group"];

const result = {978: {}, 979: {}};
for (const groupData of rangeData) {
    const [gs1, group] = groupData["Prefix"].split("-");
    result[gs1][group] = {
        "agency": groupData["Agency"],
        "rules": parseRules(groupData["Rules"]["Rule"]),
    };
}

await Deno.writeTextFile(
    path.resolve(import.meta.dirname, "../src", "range.json"),
    JSON.stringify(result, null, 1),
);
