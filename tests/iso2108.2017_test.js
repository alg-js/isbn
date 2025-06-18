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

import {assert, assertEquals, assertThrows, assertFalse} from "jsr:@std/assert";

import ISBN from "@alg/isbn/2017";


const isbn10 = "ISBN 0 14 00.2346 1";
const invalidFmt = "Not an ISBN!!";
const invalidPrefix = "9779295055125";
const invalidCheck = "9780802130205";
const invalidGroup = "9799999999983";
const invalidRegistrant = "9781060000001";

const fmtMsg = "Invalid ISBN format";
const prefixMsg = "Invalid ISBN GS1 prefix";
const digitMsg = "Invalid ISBN Check Digit";
const groupMsg = "Unrecognised ISBN group element";
const registrantMsg = "Unrecognised ISBN registrant element";

Deno.test({
    name: "Valid ISBN-13s can be parsed",
    fn: () => {
        const enemy = ISBN.parse("ISBN 978-0-8021-3020-4");
        assertEquals(enemy.agency, "English language");
        assertEquals(enemy.digits(), "9780802130204");
        assertEquals(enemy.toString(), "ISBN 978-0-8021-3020-4");
        assertEquals(enemy.components(), ["978", "0", "8021", "3020", "4"]);
    },
});

Deno.test({
    name: "ISBN-As can be validated",
    fn: () => {
        const base = ISBN.parse("9789295055124");
        const isbna = ISBN.parse("ISBN-A 10.978.92.95055/124");
        const url = ISBN.parse("https://doi.org/10.978.92.95055/124");
        assertEquals(isbna.toString(), base.toString());
        assertEquals(url.toString(), base.toString());
    },
});

Deno.test({
    name: "URN:ISBNs can be validated",
    fn: () => {
        const base = ISBN.parse("9789070002343");
        const urn = ISBN.parse("URN:ISBN:978-90-70002-34-3");
        const url = ISBN.parse("https://urn.fi/URN:ISBN:978-90-70002-34-3");
        assertEquals(urn.toString(), base.toString());
        assertEquals(url.toString(), base.toString());
    },
});

Deno.test({
    name: "ISBNs with non-latin prefixes are valid",
    fn: () => {
        const base = ISBN.parse("ISBN-13 978-0-8021-3020-4");
        const zsh13 = ISBN.parse("(国际书号-13) ISBN-13 978-0-8021-3020-4");
        assertEquals(zsh13.toString(), base.toString());
    },
});

Deno.test({
    name: "ISBNs cannot incorrectly label themselves as ISBN-10s",
    fn: () => {
        assertThrows(() => ISBN.parse("ISBN-10 978-0-14-002346-6"));
        assertThrows(() => ISBN.parse("国际书号-10 ISBN-13 978-0-14-002346-6"));
        assertThrows(() => ISBN.parse("国际书号-13 ISBN-10 978-0-14-002346-6"));
    },
});

Deno.test({
    name: "ISBNs can parse results and optionals",
    fn: () => {
        const enemy = ISBN.parse("978-0-8021-3020-4");
        const enemyResult = ISBN.parseResult("978-0-8021-3020-4");
        const enemyOptional = ISBN.parseOrUndefined("978-0-8021-3020-4");
        assertEquals(enemyResult, {result: enemy});
        assertEquals(enemyOptional, enemy);
    },
});

Deno.test({
    name: "Invalid ISBNs are not parsed",
    fn: () => {
        assertThrows(() => ISBN.parse(invalidFmt), Error, fmtMsg);
        assertThrows(() => ISBN.parse(invalidPrefix), Error, prefixMsg);
        assertThrows(() => ISBN.parse(invalidCheck), Error, digitMsg);
        assertThrows(() => ISBN.parse(invalidGroup), Error, groupMsg);
        assertThrows(() => ISBN.parse(invalidRegistrant), Error, registrantMsg);

        assertEquals(ISBN.parseResult(invalidFmt), {err: fmtMsg});
        assertEquals(ISBN.parseResult(invalidPrefix), {err: prefixMsg});
        assertEquals(ISBN.parseResult(invalidCheck), {err: digitMsg});
        assertEquals(ISBN.parseResult(invalidGroup), {err: groupMsg});
        assertEquals(ISBN.parseResult(invalidRegistrant), {err: registrantMsg});

        assertEquals(ISBN.parseOrUndefined(invalidFmt), undefined);
        assertEquals(ISBN.parseOrUndefined(invalidPrefix), undefined);
        assertEquals(ISBN.parseOrUndefined(invalidCheck), undefined);
        assertEquals(ISBN.parseOrUndefined(invalidGroup), undefined);
        assertEquals(ISBN.parseOrUndefined(invalidRegistrant), undefined);
    },
});

Deno.test({
    name: "ISBNs can be validated",
    fn: () => {
        assert(ISBN.isValid("ISBN-13 978-0-8021-3020-4"));
        assertFalse(ISBN.isValid(invalidFmt));
        assertFalse(ISBN.isValid(invalidPrefix));
        assertFalse(ISBN.isValid(invalidCheck));
        assertFalse(ISBN.isValid(invalidGroup));
        assertFalse(ISBN.isValid(invalidRegistrant));
        assertFalse(ISBN.isValid("ISBN-10 978-0-8021-3020-4"));
        assertFalse(ISBN.isValid(isbn10));
    },
});

Deno.test({
    name: "ISBNs cannot contain linebreaks",
    fn: () => {
        assertEquals(
            ISBN.parseResult("978-90-70002-34-3\n9780802130204"),
            {err: fmtMsg},
        );
        assertEquals(ISBN.parseResult("ISBN\n9780802130204"), {err: fmtMsg});
        assertEquals(ISBN.parseResult("\nISBN 9780802130204"), {err: fmtMsg});
        assertEquals(ISBN.parseResult("ISBN 9780802130204\n"), {err: fmtMsg});
        assertEquals(ISBN.parseResult("978\n90 70002 34 3"), {err: fmtMsg});
    },
});
