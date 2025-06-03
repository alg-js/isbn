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

/**
 * Returns True if the given string is a valid ISBN description as defined by
 * ISO 2108:2017 and False otherwise.
 *
 * Here "ISBN description" refers to any method of writing an ISBN. For example:
 * - A String of digits: `9780140447934`
 * - A human-readable form: `ISBN-13 978-0-140-44793-4` or `978 0 140 44793 4`
 * - A DOI/ISBN-A: `10.978.0.140/447934`
 * - A URN: `URN:ISBN:978-0-140-44793-4`
 *
 * Generally, any string that ends with an ISBN and is not prefixed with any
 * additional digits is validated.
 *
 * @example
 * ```javascript
 * import * as isbn from "@alg/isbn";
 *
 * console.log(isbn.isValid("9780140447934"));  // true
 * console.log(isbn.isValid("9780140447931"));  // false (invalid check digit)
 *
 * console.log(isbn.isValid("978-0-140-44793-4"));  // true
 * console.log(isbn.isValid("ISBN-13 978 0 140 44793 4"));  // true
 * console.log(isbn.isValid("https://doi.org/10.978.0.140/447934"));  // true
 * ```
 *
 * This does not check that the ISBN has been assigned as an ISBN, DOI, etc. —
 * just that the ISBN adders to the check-digit calculation defined by
 * ISO 2108:2017
 *
 * @param {string} string
 * @returns boolean
 */
export function isValid(string: string): boolean;

/**
 * Returns the digits of an ISBN if the given string is a valid ISBN description
 * as defined by ISO 2108:2017 and `null` otherwise. See {@link isValid} for
 * information on ISBN descriptions.
 *
 * @example
 * ```javascript
 * import * as isbn from "@alg/isbn";
 *
 * console.log(isbn.toDigits("9780140447931"));  // null (invalid check digit)
 *
 * // All 9780140447934
 * console.log(isbn.toDigits("9780140447934"));
 * console.log(isbn.toDigits("978-0-140-44793-4"));
 * console.log(isbn.toDigits("ISBN-13 978 0 140 44793 4"));
 * console.log(isbn.toDigits("https://doi.org/10.978.0.140/447934"));
 * ```
 *
 * This does not check that the ISBN has been assigned as an ISBN, DOI, etc. —
 * just that the ISBN adders to the check-digit calculation defined by
 * ISO 2108:2017
 *
 * @param {string} string
 * @returns string
 */
export function toDigits(string: string): string;
