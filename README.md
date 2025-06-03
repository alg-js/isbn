# @alg/isbn

[![JSR](https://jsr.io/badges/@alg/isbn)](https://jsr.io/@alg/isbn)
[![License](https://img.shields.io/badge/Apache--2.0-green?label=license)](https://github.com/alg-js/isbn/blob/main/LICENSE)

ISO 2108:2017 (AKA ISBN) validation

## Install

```
deno add jsr:@alg/isbn
```

## Example

The `isValid` function returns `true` if the given string is a valid ISBN
description as defined by ISO 2108:2017.

Here "ISBN description" refers to any method of writing an ISBN. For example:
- A String of digits: `9780140447934`
- A human-readable form: `ISBN-13 978-0-140-44793-4` or `978 0 140 44793 4`
- A DOI/ISBN-A: `10.978.0.140/447934`
- A URN: `URN:ISBN:978-0-140-44793-4`

```javascript
import * as isbn from "@alg/isbn";

console.log(isbn.isValid("9780140447934"));  // true
console.log(isbn.isValid("9780140447931"));  // false (invalid check digit)

console.log(isbn.isValid("978-0-140-44793-4"));  // true
console.log(isbn.isValid("ISBN-13 978 0 140 44793 4"));  // true
console.log(isbn.isValid("https://doi.org/10.978.0.140/447934"));  // true
```

This does not check that the ISBN has been assigned as an ISBN, DOI, etc. —
just that the ISBN adders to the check-digit calculation defined by
ISO 2108:2017.

The ISBN digits can be extracted from ISBN descriptions using the `toDigits`
function:

```javascript
import * as isbn from "@alg/isbn";

console.log(isbn.toDigits("9780140447931"));  // null (invalid check digit)

// All 9780140447934
console.log(isbn.toDigits("9780140447934"));
console.log(isbn.toDigits("978-0-140-44793-4"));
console.log(isbn.toDigits("ISBN-13 978 0 140 44793 4"));
console.log(isbn.toDigits("https://doi.org/10.978.0.140/447934"));
```
