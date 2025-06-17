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


import {hasValidCheckDigit, ISBN, checkDigit} from "../src/main.js";
import {range} from "jsr:@alg/range";
import {assert, assertFalse, assertEquals, assertThrows} from "jsr:@std/assert";


Deno.test({
    name: "random strings are do not have valid checksums",
    fn: () => {
        assertFalse(hasValidCheckDigit(""));
        assertFalse(hasValidCheckDigit("Foooooooooooo"));
        assertFalse(hasValidCheckDigit("1231231231231"));
        assertFalse(hasValidCheckDigit(" "));
    },
});

Deno.test({
    name: "ISBNs with an invalid check digit are not valid",
    fn: () => {
        range(10).filter((it) => it !== 4).forEach(
            (e) => assertFalse(hasValidCheckDigit(`978929505512${e}`)),
        );
    },
});

Deno.test({
    name: "Valid ISBN-13s consisting of only digits can be validated",
    fn: () => {
        assert(hasValidCheckDigit("9789295055124"));
    },
});

Deno.test({
    name: "Valid human-readable ISBN-13s can be validated",
    fn: () => {
        assert(hasValidCheckDigit("978-90-70002-34-3"));
        assert(hasValidCheckDigit("ISBN 978-90-70002-34-3"));
        assert(hasValidCheckDigit("ISBN-13 978-90-70002-34-3"));
        assert(hasValidCheckDigit("978 90 70002 34 3"));
        assert(hasValidCheckDigit("ISBN 978 90 70002 34 3"));
        assert(hasValidCheckDigit("ISBN 13 978 90 70002 34 3"));
    },
});

Deno.test({
    name: "ISBN-As can be validated",
    fn: () => {
        assert(hasValidCheckDigit("ISBN-A 10.978.92.95055/124"));
        assert(hasValidCheckDigit("https://doi.org/10.978.8889637/418"));
    },
});

Deno.test({
    name: "URN:ISBNs can be validated",
    fn: () => {
        assert(hasValidCheckDigit("URN:ISBN:978-0-395-36341-6"));
        assert(hasValidCheckDigit("URN:ISBN:9789070002343"));
        assert(hasValidCheckDigit("https://urn.fi/URN:ISBN:978-952-10-9981-6"));
    },
});


Deno.test({
    name: "ISBNs can be parsed",
    fn: () => {
        const dunce = ISBN.parse("9780802130204");
        assertEquals(dunce.toString(), "ISBN 978-0-8021-3020-4");
        assertEquals(dunce.agency, "English language");
        assertEquals(dunce.digits, "9780802130204");
        assertEquals(dunce.asNumber(), 9780802130204);

        const dunceResult = ISBN.parseResult("9780802130204");
        assertEquals(dunceResult, {result: dunce});
        const maybeDunce = ISBN.parseOrUndefined("9780802130204");
        assertEquals(maybeDunce, dunce);

        const idioten = ISBN.parse("9783423214346");
        assertEquals(idioten.toString(), "ISBN 978-3-423-21434-6");
        assertEquals(idioten.agency, "German language");
    },
});


Deno.test({
    name: "Invalid ISBNs throw when parsed",
    fn: () => {
        assertThrows(
            () => ISBN.parse("Not an ISBN!!"),
            Error,
            "Invalid ISBN format",
        );
        assertThrows(
            () => ISBN.parse("9779295055125"),
            Error,
            "Invalid ISBN GS1 prefix",
        );
        assertThrows(
            () => ISBN.parse("9780802130205"),
            Error,
            "Invalid ISBN Check Digit",
        );
        assertThrows(
            () => ISBN.parse("9799999999983"),
            Error,
            "Unrecognised ISBN group element",
        );
        assertThrows(
            () => ISBN.parse("9781060000001"),
            Error,
            "Unrecognised ISBN registrant element",
        );

        assertEquals(
            ISBN.parseResult("Not an ISBN!!"),
            {err: "Invalid ISBN format"},
        );
        assertEquals(
            ISBN.parseResult("9779295055125"),
            {err: "Invalid ISBN GS1 prefix"},
        );
        assertEquals(
            ISBN.parseResult("9780802130205"),
            {err: "Invalid ISBN Check Digit"},
        );
        assertEquals(
            ISBN.parseResult("9799999999983"),
            {err: "Unrecognised ISBN group element"},
        );
        assertEquals(
            ISBN.parseResult("9781060000001"),
            {err: "Unrecognised ISBN registrant element"},
        );

        assertEquals(
            ISBN.parseOrUndefined("Not an ISBN!!"),
            undefined,
        );
        assertEquals(
            ISBN.parseOrUndefined("9779295055125"),
            undefined,
        );
        assertEquals(
            ISBN.parseOrUndefined("9780802130205"),
            undefined,
        );
        assertEquals(
            ISBN.parseOrUndefined("9799999999983"),
            undefined,
        );
        assertEquals(
            ISBN.parseOrUndefined("9781060000001"),
            undefined,
        );
    },
});

Deno.test({
    name: "ISBNs cannot contain linebreaks",
    fn: () => {
        assertEquals(
            ISBN.parseResult("978-90-70002-34-3\n9780802130204"),
            {err: "Invalid ISBN format"},
        );
        assertEquals(
            ISBN.parseResult("ISBN\n9780802130204"),
            {err: "Invalid ISBN format"},
        );
        assertEquals(
            ISBN.parseResult("\nISBN 9780802130204"),
            {err: "Invalid ISBN format"},
        );
        assertEquals(
            ISBN.parseResult("ISBN 9780802130204\n"),
            {err: "Invalid ISBN format"},
        );
        assertEquals(
            ISBN.parseResult("978\n90 70002 34 3"),
            {err: "Invalid ISBN format"},
        );
    },
});

Deno.test({
    name: "Reserved agencies have no valid ISBNs",
    fn: () => {
        assertEquals(
            ISBN.parseResult("9789990200003"),
            {err: "Unrecognised ISBN registrant element"},
        );
    },
});

Deno.test({
    name: "Registrant ranges with no length have no valid ISBNs",
    fn: () => {
        assertEquals(
            ISBN.parseResult("9781060000001"),
            {err: "Unrecognised ISBN registrant element"},
        );
    },
});


Deno.test({
    name: "ISBN strings can be validated without parsing",
    fn: () => {
        assert(ISBN.isValid("9780802130204"));
        assert(ISBN.isValid("9783423214346"));
        assertFalse(ISBN.isValid("Not an ISBN!!"));
        assertFalse(ISBN.isValid("9779295055125"));
        assertFalse(ISBN.isValid("9780802130205"));
        assertFalse(ISBN.isValid("9799999999983"));
        assertFalse(ISBN.isValid("9781060000001"));
    },
});

Deno.test({
    name: "Strings can have their check digits calculated",
    fn: () => {
        assertEquals(checkDigit("978080213020"), "4");
        assertEquals(checkDigit("978342321434"), "6");
    },
});

Deno.test({
    name: "check digits are undefined for strings of the wrong length",
    fn: () => {
        assertEquals(checkDigit("9780802130201"), undefined);
        assertEquals(checkDigit("97834232143"), undefined);
    },
});
