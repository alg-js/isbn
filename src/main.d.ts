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
 * Metadata associated with ISBN values as defined by the ISO 2108:2017 (ISBN)
 * standard.
 *
 * Allows for validating and parsing ISBNs into GS1, group, registrant,
 * publication, anc check digit elements.
 *
 * See {@link ISBN.parse} for more information.
 */
export class ISBN {
  /** The GS1 element */
  readonly gs1: string;
  /** The group element */
  readonly group: string;
  /** The registrant element */
  readonly registrant: string;
  /** The publication element */
  readonly publication: string;
  /** The check digit element */
  readonly checkDigit: string;
  /** Returns the elements of this ISBN joined by hyphens. */
  readonly [Symbol.toStringTag]: string;

  /**
   * Parses the given ISBN string and throws if the given string cannot be
   * validated according to the ISO 2108:2017 (ISBN) standard.
   *
   * A valid ISBN will have a registered GS1 prefix and allocated group and
   * registrant numbers from the ISBN Registration Authority. This does not
   * necessarily mean the group and registrants are in use or that the
   * registrant number has been _assigned_ to a registrant — only that the
   * given ISBN falls under the allocated registrant ranges for the given group.
   *
   * ISBNs can be formatted as, for example:
   * - A String of digits: `9780140447934`
   * - A human-readable form: `ISBN-13 978-0-140-44793-4` or `978 0 140 44793 4`
   * - A DOI/ISBN-A: `10.978.0.140/447934`
   * - A URN: `URN:ISBN:978-0-140-44793-4`
   *
   * Generally, any string that ends with an ISBN which is not immediately
   * prefixed with any additional digits is validated.
   *
   * This method does not check that the ISBN has been assigned as an ISBN,
   * DOI, etc. — only that the group and registrant numbers have been allocated
   * by the ISBN Registration Authority and that the check-digit is valid
   * as defined by the ISO 2108:2017 (ISBN) standard.
   *
   * See {@link ISBN.parseResult} for an equivalent function that returns a
   * result type instead of throwing on errors.
   *
   * @example Valid ISBN
   * ```javascript
   * import {ISBN} from "@alg/isbn";
   *
   * const dunce = ISBN.parse("9780802130204")
   * console.log(dunce);  // ISBN [978-0-8021-3020-4] {}
   * console.log(dunce.agency);  // English language
   * ```
   *
   * @example Invalid ISBN
   * ```javascript
   * import {ISBN} from "@alg/isbn";
   *
   * function logErr(isbn) {
   *     try {
   *         ISBN.parse(isbn);
   *     } catch (e) {
   *         console.log(e.toString());
   *     }
   * }
   *
   * logErr("Not an ISBN!!");  // Error: Invalid ISBN format
   * logErr("9780802130205");  // Error: Invalid ISBN Check Digit
   * logErr("9799999999983");  // Error: Unrecognised ISBN group element
   * logErr("9781060000001");  // Error: Unrecognised ISBN registrant element
   * ```
   *
   * @param {string} string
   * @returns ISBN
   * @throws {Error} if the given ISBN string is not valid
   */
  static parse(string: string): ISBN;

  /**
   * Attempts to parse the given ISBN string.
   *
   * If the given string cannot be validated according to the ISO 2108:2017
   * (ISBN) standard, an object describing any errors in parsing is return of
   * the form: `{err: "some error message"}`.
   * If the given string can be validated, a result is returned of the form:
   * `{result: anIsbnObject}`.
   *
   * See {@link ISBN.parse} for more information on what constitutes a valid
   * ISBN string.
   *
   * @example Valid ISBN
   * ```javascript
   * import {ISBN} from "@alg/isbn";
   *
   * const dunce = ISBN.parseResult("9780802130204");
   * console.log(dunce);  // {result: ISBN [978-0-8021-3020-4] {}}
   * ```
   *
   * @example Invalid ISBN
   * ```javascript
   * import {ISBN} from "@alg/isbn";
   *
   * const res1 = ISBN.parseResult("Not an ISBN!!");
   * console.log(res1);  // {err: "Invalid ISBN format"}
   * const res2 = ISBN.parseResult("9780802130205");
   * console.log(res2);  // {err: "Invalid ISBN Check Digit"}
   * const res3 = ISBN.parseResult("9799999999983");
   * console.log(res3);  // {err: "Unrecognised ISBN group element"}
   * const res4 = ISBN.parseResult("9781060000001");
   * console.log(res4);  // {err: "Unrecognised ISBN registrant element"}
   * ```
   *
   * @param {string} string
   * @returns {{result: ISBN} | {err: string}}
   */
  static parseResult(string: string): {result: ISBN} | {err: string};

  /**
   * Attempts to parse the given ISBN string. Returns an {@link ISBN} object if
   * the given string can be parsed or `undefined` otherwise.
   *
   * See {@link ISBN.parse} for more information on what constitutes a valid
   * ISBN string.
   *
   * @example Valid ISBN
   * ```javascript
   * import {ISBN} from "@alg/isbn";
   *
   * const dunce = ISBN.parseOrUndefined("9780802130204");
   * console.log(dunce);  // ISBN [978-0-8021-3020-4] {}
   * ```
   *
   * @example Invalid ISBN
   * ```javascript
   * import {ISBN} from "@alg/isbn";
   *
   * const oops = ISBN.parseOrUndefined("Not an ISBN!!");
   * console.log(oops);  // undefined
   * ```
   *
   * @param {string} string
   * @returns {ISBN|undefined}
   */
  static parseOrUndefined(string: string): ISBN | undefined;

  /** Returns a 5-tuple of the elements of this ISBN. */
  elements(): [string, string, string, string, string];

  /** Returns the agency name of the registration group for this ISBN */
  get agency(): string;

  /** Returns the digits of this ISBN as a string */
  get digits(): string;

  /** Returns the digits of this ISBN as a number */
  asNumber(): number;

  /**
   * Returns a human-readable version of this ISBN as defined by the
   * ISO 2108:2017 (ISBN) standard.
   */
  toString(): string;
}

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
 * console.log(isbn.hasValidChecksum("9780140447934"));  // true
 *
 * // false (invalid check digit)
 * console.log(isbn.hasValidChecksum("9780140447931"));
 *
 * // All true
 * console.log(isbn.hasValidChecksum("978-0-140-44793-4"));
 * console.log(isbn.hasValidChecksum("ISBN-13 978 0 140 44793 4"));
 * console.log(isbn.hasValidChecksum("https://doi.org/10.978.0.140/447934"));
 * ```
 *
 * This function does not check that the ISBN has been assigned as an ISBN,
 * DOI, etc.; nor does this function check whether the group and registrant
 * numbers have been allocated by the ISBN Registration Authority — only that
 * the ISBN adders to the check-digit calculation defined by the ISO 2108:2017
 * (ISBN) standard.
 *
 * @param {string} string
 * @returns boolean
 */
export function hasValidChecksum(string: string): boolean;
