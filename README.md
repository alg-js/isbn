# @alg/isbn

[![Repository](https://img.shields.io/badge/algjs%2Fisbn-102335?logo=codeberg&labelColor=07121A)](https://codeberg.org/algjs/isbn)
[![License](https://img.shields.io/badge/Apache--2.0-green?label=license)](https://codeberg.org/algjs/isbn/src/branch/main/LICENSE)
[![JSR](https://jsr.io/badges/@alg/isbn)](https://jsr.io/@alg/isbn)

A standalone package for ISO 2108:2017 (AKA ISBN) parsing, validating, and
formatting ISBN values.

Provides legacy support for ISO 2108:2005 (e.g. ISBN-10s).

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

The default export of this library (`@alg/isbn`) default exports an `ISBN` class
that validates, parses, and formats strings according to the latest ISO 2108
standard. Specific versions of the standard can be accessed in their respective
exports: `@alg/isbn/2005`, `@alg/isbn/2017`. Each of these modules default
exports an `ISBN` class that adheres to that particular standard. The interfaces
for these classes are the same.

When parsing or validating ISBNs, the following checks occur:

- General formatting is validated (e.g. the given string is a string of digits,
  a human-readable ISBN, an ISBN-A, DOI, or a URN)
- The GS1 element is validated (for ISBN-13s)
- The registration group is validated to be allocated by the registration
  authority
- The registrant is checked to be within the currently allocated ranges by the
  registration authority
- The check digit is validated

Below are some examples of ISBNs being parsed:

```javascript
import ISBN from "@alg/isbn";

const dunce = ISBN.parse("9780802130204");
console.log(dunce.toString());  // ISBN 978-0-8021-3020-4
console.log(dunce.agency);  // English language
console.log(dunce.publication);  // 3020

const idioten = ISBN.parse("ISBN 978 3 423 21434 6");
console.log(idioten.toString());  // ISBN 978-3-423-21434-6
console.log(idioten.agency);  // German language
console.log(idioten.registrant);  // 423

const 笨蛋联盟 = ISBN.parse("(国际书号13) ISBN-13: 978-9865896454");
console.log(笨蛋联盟.toString());  // ISBN 978-986-5896-45-4
console.log(笨蛋联盟.gs1);  // 978
console.log(笨蛋联盟.checkDigit);  // 4
```

In practice, many websites, stores, publishers do not strictly follow the ISO
2108 formatting specifications; this library provides some leniency as to how
ISBNs can be formatted.

Three static constructor methods for parsing ISBNs are available:

- `ISBN.parse`: Throws if an ISBN is not valid with a reason
- `ISBN.parseResult`: Returns an object indicating whether the parsing was
  successful of the form `{result: ISBN}|{err: reason}`
- `ISBN.parseOrUndefined`: Returns an ISBN or undefined if the given string is
  not a valid ISBN

For example:

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

The reasons for failure are:

- Invalid ISBN format
- Invalid ISBN GS1 prefix
- Invalid ISBN Check Digit
- Unrecognised ISBN group element
- Unrecognised ISBN registrant element

To simply validate strings without parsing them, the `ISBN.isValid` static
method will return `true` if the given string is a valid ISBN and `false`
otherwise:

```javascript
import ISBN from "@alg/isbn";

console.log(ISBN.isValid("9780802130204"));  // true
console.log(ISBN.isValid("FooBar"));  // false
```

### Legacy ISBNs

The `@alg/isbn/2005` module implements the ISO 2108:2005 standard. The interface
for this module is the same as the `2017` module. The only difference is that
ISBNs can be formatted as either ISBN-10 or ISBN-13 elements:

```javascript
import ISBN from "@alg/isbn/2005";

const enemy = ISBN.parse("ISBN 0 14 00.2346 1");
console.log(enemy.toString());  // ISBN 978-0-14-002346-6
console.log(enemy.toString({format: "ISBN"}));  // ISBN 978-0-14-002346-6
console.log(enemy.toString({format: "ISBN-13"}));  // ISBN-13 978-0-14-002346-6
console.log(enemy.toString({format: "ISBN-10"}));  // ISBN-10 0-14-002346-1
```

By default, ISO 2108:2005 ISBNs are formatted as ISBN-13 values without the
"13" included in the prefix.
