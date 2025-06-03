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


import {isValid, toDigits} from "../src/main.js";
import {range} from "jsr:@alg/range";
import {assert, assertFalse, assertEquals} from "jsr:@std/assert";


Deno.test({
    name: "random strings are not ISBNs",
    fn: () => {
        assertFalse(isValid(""));
        assertFalse(isValid("Foooooooooooo"));
        assertFalse(isValid("1231231231231"));
        assertFalse(isValid(" "));
    },
});

Deno.test({
    name: "ISBNs with an invalid check digit are not valid",
    fn: () => {
        range(10).filter((it) => it !== 4).forEach(
            (e) => assertFalse(isValid(`978929505512${e}`)),
        );
    },
});

Deno.test({
    name: "ISBNs with a valid check digit but unrecognised gs1 are not valid",
    fn: () => {
        assertFalse(isValid("9779295055125"));
        assertEquals(toDigits("9779295055125"), null);
    },
});

Deno.test({
    name: "Valid ISBN-13s consisting of only digits can be validated",
    fn: () => {
        assert(isValid("9789295055124"));
    },
});

Deno.test({
    name: "Valid human-readable ISBN-13s can be validated",
    fn: () => {
        assert(isValid("978-90-70002-34-3"));
        assert(isValid("ISBN 978-90-70002-34-3"));
        assert(isValid("ISBN-13 978-90-70002-34-3"));
        assert(isValid("978 90 70002 34 3"));
        assert(isValid("ISBN 978 90 70002 34 3"));
        assert(isValid("ISBN 13 978 90 70002 34 3"));
    },
});

Deno.test({
    name: "ISBN-As can be validated",
    fn: () => {
        assert(isValid("ISBN-A 10.978.92.95055/124"));
        assert(isValid("https://doi.org/10.978.8889637/418"));
    },
});

Deno.test({
    name: "URN:ISBNs can be validated",
    fn: () => {
        assert(isValid("URN:ISBN:978-0-395-36341-6"));
        assert(isValid("URN:ISBN:9789070002343"));
        assert(isValid("https://urn.fi/URN:ISBN:978-952-10-9981-6"));
    },
});
