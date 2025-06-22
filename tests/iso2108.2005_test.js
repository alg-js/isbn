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

import ISBN from "@alg/isbn/2005";

const invalidFmt = "Not an ISBN!!";
const invalidPrefix = "9779295055125";
const invalidCheck13 = "9780802130205";
const invalidGroup13 = "9799999999983";
const invalidRegistrant13 = "9781060000001";
const invalidCheck10 = "0 14 00.2346 2";
const invalidGroup10 = "9999999984";
const invalidRegistrant10 = "1060000006";

const fmtMsg = "Invalid ISBN format";
const prefixMsg = "Invalid ISBN GS1 prefix";
const digitMsg = "Invalid ISBN Check Digit";
const groupMsg = "Unrecognised ISBN group element";
const registMsg = "Unrecognised ISBN registrant element";

Deno.test({
    name: "Valid ISBN-10s can be parsed",
    fn: () => {
        const enemy = ISBN.parseOrThrow("ISBN 0 14 00.2346 1");
        assertEquals(enemy.agency, "English language");
        assertEquals(enemy.digits(), "9780140023466");
        assertEquals(enemy.digits({format: "ISBN-13"}), "9780140023466");
        assertEquals(enemy.digits({format: "ISBN-10"}), "0140023461");
        assertEquals(enemy.toString(), "ISBN 978-0-14-002346-6");
        assertEquals(
            enemy.toString({format: "ISBN-13"}),
            "ISBN-13 978-0-14-002346-6",
        );
        assertEquals(
            enemy.toString({format: "ISBN-10"}),
            "ISBN-10 0-14-002346-1",
        );
        assertEquals(enemy.components(), ["978", "0", "14", "002346", "6"]);
        assertEquals(
            enemy.components({format: "ISBN-10"}),
            ["0", "14", "002346", "1"],
        );
    },
});

Deno.test({
    name: "Valid ISBN-13s can be parsed",
    fn: () => {
        const enemy = ISBN.parseOrThrow("ISBN-13 978-0-8021-3020-4");
        assertEquals(enemy.agency, "English language");
        assertEquals(enemy.digits(), "9780802130204");
        assertEquals(enemy.digits({format: "ISBN-13"}), "9780802130204");
        assertEquals(enemy.digits({format: "ISBN-10"}), "0802130208");
        assertEquals(enemy.toString(), "ISBN 978-0-8021-3020-4");
        assertEquals(
            enemy.toString({format: "ISBN-13"}),
            "ISBN-13 978-0-8021-3020-4",
        );
        assertEquals(
            enemy.toString({format: "ISBN-10"}),
            "ISBN-10 0-8021-3020-8",
        );
        assertEquals(enemy.components(), ["978", "0", "8021", "3020", "4"]);
        assertEquals(
            enemy.components({format: "ISBN-10"}),
            ["0", "8021", "3020", "8"],
        );
    },
});

Deno.test({
    name: "Format functions reject unrecognised formats",
    fn: () => {
        const enemy = ISBN.parseOrThrow("ISBN 0 14 00.2346 1");
        assertThrows(() => enemy.digits({format: "ISBN-12"}));
        assertThrows(() => enemy.toString({format: "ISBN-12"}));
        assertThrows(() => enemy.components({format: "ISBN-12"}));
    },
});

Deno.test({
    name: "ISBNs with non-latin prefixes are valid",
    fn: () => {
        const base = ISBN.parseOrThrow("ISBN 0 14 00.2346 1");
        const zsh10 = ISBN.parseOrThrow("(国际书号-10) ISBN-10 0 14 00.2346 1");
        const zsh13 = ISBN.parseOrThrow("(国际书号-13) ISBN-13 978-0-14-002346-6");
        assertEquals(zsh10.toString(), base.toString());
        assertEquals(zsh13.toString(), base.toString());
    },
});

Deno.test({
    name: "ISBNs cannot incorrectly label themselves as ISBN-10 or ISBN-13",
    fn: () => {
        assertThrows(() => ISBN.parseOrThrow("ISBN-13 0 14 00.2346 1"));
        assertThrows(() => ISBN.parseOrThrow("ISBN-10 978-0-14-002346-6"));
        assertThrows(() => ISBN.parseOrThrow("国际书号-13 ISBN-10 0 14 00.2346 1"));
        assertThrows(() => ISBN.parseOrThrow("国际书号-10 ISBN-13 978-0-14-002346-6"));
        assertThrows(() => ISBN.parseOrThrow("国际书号-10 ISBN-13 0 14 00.2346 1"));
        assertThrows(() => ISBN.parseOrThrow("国际书号-13 ISBN-10 978-0-14-002346-6"));
    },
});

Deno.test({
    name: "ISBNs can parse results and optionals",
    fn: () => {
        const enemy = ISBN.parseOrThrow("ISBN 0 14 00.2346 1");
        const enemyResult = ISBN.parseResult("ISBN 0 14 00.2346 1");
        const enemyOptional = ISBN.parseOrUndefined("ISBN 0 14 00.2346 1");
        assertEquals(enemyResult, {result: enemy});
        assertEquals(enemyOptional, enemy);
    },
});

Deno.test({
    name: "Invalid ISBNs are not parsed",
    fn: () => {
        assertThrows(() => ISBN.parseOrThrow(invalidFmt), Error, fmtMsg);
        assertThrows(() => ISBN.parseOrThrow(invalidPrefix), Error, prefixMsg);
        assertThrows(() => ISBN.parseOrThrow(invalidCheck13), Error, digitMsg);
        assertThrows(() => ISBN.parseOrThrow(invalidGroup13), Error, groupMsg);
        assertThrows(() => ISBN.parseOrThrow(invalidRegistrant13), Error, registMsg);
        assertThrows(() => ISBN.parseOrThrow(invalidCheck10), Error, digitMsg);
        assertThrows(() => ISBN.parseOrThrow(invalidGroup10), Error, groupMsg);
        assertThrows(() => ISBN.parseOrThrow(invalidRegistrant10), Error, registMsg);

        assertEquals(ISBN.parseResult(invalidFmt), {err: fmtMsg});
        assertEquals(ISBN.parseResult(invalidPrefix), {err: prefixMsg});
        assertEquals(ISBN.parseResult(invalidCheck13), {err: digitMsg});
        assertEquals(ISBN.parseResult(invalidGroup13), {err: groupMsg});
        assertEquals(ISBN.parseResult(invalidRegistrant13), {err: registMsg});
        assertEquals(ISBN.parseResult(invalidCheck10), {err: digitMsg});
        assertEquals(ISBN.parseResult(invalidGroup10), {err: groupMsg});
        assertEquals(ISBN.parseResult(invalidRegistrant10), {err: registMsg});

        assertEquals(ISBN.parseOrUndefined(invalidFmt), undefined);
        assertEquals(ISBN.parseOrUndefined(invalidPrefix), undefined);
        assertEquals(ISBN.parseOrUndefined(invalidCheck13), undefined);
        assertEquals(ISBN.parseOrUndefined(invalidGroup13), undefined);
        assertEquals(ISBN.parseOrUndefined(invalidRegistrant13), undefined);
        assertEquals(ISBN.parseOrUndefined(invalidCheck10), undefined);
        assertEquals(ISBN.parseOrUndefined(invalidGroup10), undefined);
        assertEquals(ISBN.parseOrUndefined(invalidRegistrant10), undefined);
    },
});

Deno.test({
    name: "ISBNs can be validated",
    fn: () => {
        assert(ISBN.isValid("ISBN 0 14 00.2346 1"));
        assert(ISBN.isValid("ISBN-13 978-0-8021-3020-4"));
        assertFalse(ISBN.isValid(invalidFmt));
        assertFalse(ISBN.isValid(invalidPrefix));
        assertFalse(ISBN.isValid(invalidCheck13));
        assertFalse(ISBN.isValid(invalidGroup13));
        assertFalse(ISBN.isValid(invalidRegistrant13));
        assertFalse(ISBN.isValid("ISBN-13 0 14 00.2346 1"));
        assertFalse(ISBN.isValid("ISBN-10 978-0-8021-3020-4"));
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
