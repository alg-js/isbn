# @alg/isbn

[![Repository](https://img.shields.io/badge/algjs%2Fisbn-102335?logo=codeberg&labelColor=07121A)](https://codeberg.org/algjs/isbn)
[![License](https://img.shields.io/badge/Apache--2.0-green?label=license)](https://codeberg.org/algjs/isbn/src/branch/main/LICENSE)
[![JSR](https://jsr.io/badges/@alg/isbn)](https://jsr.io/@alg/isbn)

A standalone package for ISO 2108:2017 (AKA ISBN) parsing, metadata, and
validation. Provides legacy support for ISO 2108:2005 (e.g. ISBN-10s).

## Install

```bash
deno add jsr:@alg/isbn
```

<details>
<summary>Other Install Options</summary>

```bash
npx jsr add @alg/isbn
```

```bash
bunx jsr add @alg/isbn
```

```bash
pnpm i jsr:@alg/isbn
```

```bash
yarn add jsr:@alg/isbn
```

```bash
vlt install jsr:@alg/isbn
```

</details>

## Example

This package exports an `ISBN` class and a `validateChecksum` function. All
functions/methods can parse ISBNs in digit, human-readable, ISBN-A, and URN
formats as defined by the ISO 2108:2017 (ISBN) standard. See the
[Valid Formats](#valid-formats) section of this documentation for the details of
supported ISBN formats.

The `ISBN` class parses and processes the GS1, group, registrant, publication,
and check digit elements of ISBNs. As well as validating the group and
registrant have been assigned by the ISBN Registration Authority and that the
ISBN has a valid check digit. The `ISBN` class also provides metadata on the
group agencies that have been assigned by the ISBN Registration Authority. For
example:

```javascript
import {ISBN} from "@alg/isbn";

const dunce = ISBN.parse("9780802130204");
console.log(dunce.toString());  // ISBN 978-0-8021-3020-4
console.log(dunce.agency);  // English language

const idioten = ISBN.parse("ISBN 978 3 423 21434 6");
console.log(idioten.toString());  // ISBN 978-3-423-21434-6
console.log(idioten.agency);  // German language
```

The allocated group and registrant rages are current up to June 2025, if the
group allocations have been updated since then, please create an issue on this
repository.

When parsing ISBNs the methods `parse`, `parseResult`, and `parseOrUndefined`
handle invalid ISBNs in different ways:

```javascript
import {ISBN} from "@alg/isbn";

try {
    ISBN.parse("9799999999983");
} catch (e) {
    console.log(e.toString());  // Error: Unrecognised ISBN group element
}

// {err: "Invalid ISBN Check Digit"},
console.log(ISBN.parseResult("9780802130205"));

console.log(ISBN.parseOrUndefined("Not an ISBN!!"));  // undefined
```

If you only need to validate the checksum of ISBNs, use the `validateChecksum`
function:

```javascript
import {hasValidCheckDigit} from "@alg/isbn";

console.log(hasValidCheckDigit("9780802130204"));  // true
console.log(hasValidCheckDigit("9780802130205"));  // false
```

Check-digits for ISBNs can be calculated using the `checkDigit` function:

```javascript
import {checkDigit} from "@alg/isbn";

console.log(checkDigit("978080213020"));  // "4"
```

### ISO 2108:2005 (e.g. ISBN-10 values)

The `@alg/isbn/legacy` endpoint provides an `ISBN` class, and
`hasValidCheckDigit` and `checkDigit` functions. These work in the same way as
`@alg/isbn` but can parse ISBN-10 and ISBN-13 values.

Note: the legacy ISBN class has no constructor. When parsing ISBN values using
the `parse` constructor methods on the legacy ISBN class, an instance of the
base `@alg/isbn` `ISBN` class is returned. Conversion from ISBN-10 to ISBN-13
values is automatic.

## Valid Formats

@alg/isbn attempts to adhere to the ISO 2108:2017 (ISBN) standard while allowing
for reasonable flexibility for the format of ISBN values. For example, common
variations to ISBN values that deviate from the strict ISO 2108:2017 standard
include:

- Separating elements in human-readable ISBNs by spaces instead of hyphens. For
  example, the British Standards publication of the ISBN standard does this:
  "ISBN 978 0 580 85272 5" (should be "ISBN 978-0-580-85272-5")
- Changing the position of hyphens between the registrant element and
  publication element. For example, Penguin does this: "ISBN
  978-0-141-43954-9" (according to the standard, this should be "ISBN
  978-0-14-143954-9")
- For historic reasons, some ISBNs may indicate that they are specifically
  ISBN-13 values and not ISBN-10. This distinction is no longer covered by the
  2017 standard, but several websites or older copies of books still make this
  distinction.

The ISBN standard also has some flexibility:

- The ISBN standard requires human-readable ISBNs to be prefixed with "ISBN" or
  a translated initialism may also be given alongside the "ISBN" prefix.
  However, it is unclear whether this convention is actually in use.
- The ISBN standard does not mention whether ISBN URNs should separate ISBN
  elements with hyphens. In practice, ISBN URNs may or may not include hyphens.
- The ISBN standard does not mention whether period characters should separate
  ISBN elements in ISBN-As. In practice, ISBN-As may or may not do this.

These variations are handled by this library.
