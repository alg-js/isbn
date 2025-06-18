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

/**
 * A validator, parser, and formatter for ISO 2108:2017 (ISBN) strings.
 *
 * Validates GS1, registration group, registrant, and check digit elements.
 */
export default class ISBN {
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

    /** The agency name for the ISBN group */
    readonly agency: string;
    /** Returns the elements of this ISBN joined by hyphens. */
    readonly [Symbol.toStringTag]: string;

    /**
     * Parses a given ISBN. Throws if the ISBN is not valid.
     *
     * @param {string} string
     * @returns {ISBN}
     * @throws {Error} If the ISBN is not valid with a reason
     */
    static parse(string: string): ISBN;

    /**
     * Parses a given ISBN as a result. A result is of the form:
     *
     * - `{result: ISBN}` if the given ISBN is valid
     * - `{err: reason}` if the given ISBN is not valid
     *
     * @param {string} string
     */
    static parseResult(string: string): { err: string } | { result: ISBN };

    /**
     * Parses a given ISBN. Returns undefined if the given ISBN is not valid
     *
     * @param {string} string
     * @returns {ISBN|undefined}
     */
    static parseOrUndefined(string: string): ISBN | undefined;

    /**
     * Returns `true` if the given ISBN is valid and `false` otherwise.
     *
     * @param {string} string
     * @returns {boolean}
     */
    static isValid(string: string): boolean;

    /**
     * Returns a 5-tuple containing the GS1, registration group, registrant,
     * publication, and check digit elements.
     */
    components(
        options?: Record<PropertyKey, never>,
    ): [string, string, string, string, string];

    /** Returns the digits of the ISBN as a string */
    digits(options?: Record<PropertyKey, never>): string;

    /** Returns the elements of this ISBN separated by hyphens */
    toString(options?: Record<PropertyKey, never>): string;
}
