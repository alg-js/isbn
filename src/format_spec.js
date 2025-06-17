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


const prefix = /\D*(?:13)?\s*(?<!\d)/.source;
const doiPrefix = /.*(?<!\d)10\./.source;

const digits13 = /\d{13}/.source;
const hyphens13 = /\d{3}-\d+-\d+-\d+-\d/.source;
const spaces13 = /\d{3}\s+\d+\s+\d+\s+\d+\s+\d/.source;
const url = /\d{3}\.[\d.]+\/\d+/.source;

const isbn13 = `(?<digits>(?:${digits13})|(?:${hyphens13})|(?:${spaces13}))`;
const isbna13 = `(?<digits>${url})`;

export const ISBN_13 = new RegExp(
    `(?:^${prefix}${isbn13}$)|(?:^${doiPrefix}${isbna13}$)`,
);

const prefix10 = /\D*(?:10)?\s*(?<!\d)/.source;

const digits10 = /\d{9}[\dXx]/.source
const hyphens10 = /\d+-\d+-\d+-[\dXx]/.source
const spaces10 = /\d+\s+\d+\s+\d+\s+[\dXx]/.source

const isbn10 = `(?<digits>(?:${digits10})|(?:${hyphens10})|(?:${spaces10}))`;

export const ISBN_10 = new RegExp(`(?:^${prefix10}${isbn10}$)`);
