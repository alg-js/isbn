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

import {assert, assertEquals, assertThrows} from "jsr:@std/assert";
import {
    checkDigit,
    hasValidCheckDigit,
    ISBN as LegacyISBN,
} from "@alg/isbn/legacy";
import {ISBN} from "../src/main.js";

Deno.test({
    name: "ISBN-10s are recognised",
    fn: () => {
        const enemy = LegacyISBN.parse("0 14 002346 1");
        assertEquals(enemy.toString(), "ISBN 978-0-14-002346-6");
        assertEquals(enemy.agency, "English language");
        assertEquals(enemy.digits, "9780140023466");
        assertEquals(enemy.asNumber(), 9780140023466);

        assertEquals(
            LegacyISBN.parseResult("ISBN-10 014005510X"),
            {result: new ISBN("978", "0", "14", "005510", "8")},
        );
        assertEquals(
            LegacyISBN.parseOrUndefined("ISBN 0140016481"),
            new ISBN("978", "0", "14", "001648", "2"),
        );
    },
});

Deno.test({
    name: "Invalid ISBN-10s are not parsed",
    fn: () => {
        assertThrows(
            () => LegacyISBN.parse("Not an ISBN!!"),
            Error,
            "Invalid ISBN format",
        );
        assertThrows(
            () => LegacyISBN.parse("0 14 002346 2"),
            Error,
            "Invalid ISBN Check Digit",
        );
        assertThrows(
            () => LegacyISBN.parse("9999999992"),
            Error,
            "Unrecognised ISBN group element",
        );
        assertThrows(
            () => LegacyISBN.parse("1060000006"),
            Error,
            "Unrecognised ISBN registrant element",
        );

        assertEquals(
            LegacyISBN.parseResult("Not an ISBN!!"),
            {err: "Invalid ISBN format"},
        );
        assertEquals(
            LegacyISBN.parseResult("0 14 002346 2"),
            {err: "Invalid ISBN Check Digit"},
        );
        assertEquals(
            LegacyISBN.parseResult("9999999992"),
            {err: "Unrecognised ISBN group element"},
        );
        assertEquals(
            LegacyISBN.parseResult("1060000006"),
            {err: "Unrecognised ISBN registrant element"},
        );

        assertEquals(LegacyISBN.parseOrUndefined("Not an ISBN!!"), undefined);
        assertEquals(LegacyISBN.parseOrUndefined("0 14 002346 2"), undefined);
        assertEquals(LegacyISBN.parseOrUndefined("9999999992"), undefined);
        assertEquals(LegacyISBN.parseOrUndefined("1060000006"), undefined);
    },
});


Deno.test({
    name: "ISBN-10 check digits can be validated",
    fn: () => {
        assert(hasValidCheckDigit("0140023461"));
        assert(hasValidCheckDigit("014005510X"));
        assert(hasValidCheckDigit("1060000006"));
    },
});


Deno.test({
    name: "ISBN-10 check digits can be calculated",
    fn: () => {
        assertEquals(checkDigit("014002346"), "1");
        assertEquals(checkDigit("014005510"), "X");
    },
});


Deno.test({
    name: "ISBN-10 check digits are undefined for strings of the wrong length",
    fn: () => {
        assertEquals(checkDigit("0140023461"), undefined);
        assertEquals(checkDigit("01400551"), undefined);
        assertEquals(checkDigit("0140023461111"), undefined);
        assertEquals(checkDigit("01400551111"), undefined);
    },
});


Deno.test({
    name: "ISBN-10s can be validated",
    fn: () => {
        assert(LegacyISBN.isValid("0 14 002346 1"));
        assert(LegacyISBN.isValid("014005510X"));
    },
});


Deno.test({
    name: "Legacy ISBN can parse ISBN13s",
    fn: () => {
        assert(LegacyISBN.isValid("9780802130204"));
        assertEquals(
            LegacyISBN.parse("9780802130204"),
            ISBN.parse("9780802130204"),
        );
        assertEquals(
            LegacyISBN.parseResult("9780802130204"),
            ISBN.parseResult("9780802130204"),
        );
        assertEquals(
            LegacyISBN.parseOrUndefined("9780802130204"),
            ISBN.parseOrUndefined("9780802130204"),
        );
    },
});


Deno.test({
    name: "Legacy ISBN can validate ISBN13s",
    fn: () => {
        assert(hasValidCheckDigit("9780802130204"));
    },
});


Deno.test({
    name: "Legacy ISBN can validate ISBN13s",
    fn: () => {
        assertEquals(checkDigit("978080213020"), "4");
    },
});
