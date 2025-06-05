# @alg/isbn

[![JSR](https://jsr.io/badges/@alg/isbn)](https://jsr.io/@alg/isbn)
[![License](https://img.shields.io/badge/Apache--2.0-green?label=license)](https://github.com/alg-js/isbn/blob/main/LICENSE)

A standalone package for ISO 2108:2017 (AKA ISBN) parsing, metadata, and
validation.

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
formats as defined by the ISO 2108:2017 (ISBN) standard.

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

The allocated group and registrant rages are current up to July 2025, if the
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
import {validateChecksum} from "@alg/isbn";

console.log(validateChecksum("9780802130204"));  // true
console.log(validateChecksum("9780802130205"));  // false
```

This also ensures the GS1 prefix is valid.
